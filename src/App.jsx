import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const BankStatementProcessor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback((event) => {
    const uploadedFiles = Array.from(event.target.files);
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }
    
    setFiles(pdfFiles);
    setError(null);
    setResults(null);
  }, []);

  const processFiles = async () => {
    if (files.length === 0) {
      setError('Veuillez sélectionner au moins un fichier PDF');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const allTransactions = [];
      const allDescriptifs = [];

      for (const file of files) {
        const base64Data = await convertToBase64(file);
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "document",
                    source: {
                      type: "base64",
                      media_type: "application/pdf",
                      data: base64Data,
                    },
                  },
                  {
                    type: "text",
                    text: `Analysez ce relevé bancaire marocain et extrayez les informations suivantes pour chaque transaction. Répondez UNIQUEMENT avec un objet JSON valide selon ce format:

{
  "banque": "nom de la banque",
  "transactions": [
    {
      "date_valeur": "YYYY-MM-DD",
      "date_operation": "YYYY-MM-DD", 
      "debit": "montant ou null",
      "credit": "montant ou null",
      "reference": "identifiant unique",
      "descriptif_brut": "texte complet du descriptif"
    }
  ]
}

IMPORTANT:
- Une seule des colonnes débit/crédit doit être renseignée par transaction
- La référence doit être un identifiant unique pour chaque transaction
- Incluez le descriptif complet tel qu'il apparaît
- Assurez-vous que chaque référence est unique
- Répondez UNIQUEMENT avec du JSON valide, aucun autre texte`
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        let responseText = data.content[0].text;
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        const parsedData = JSON.parse(responseText);
        
        // Traiter les transactions
        parsedData.transactions.forEach(transaction => {
          allTransactions.push({
            ...transaction,
            banque: parsedData.banque
          });
          
          // Parser le descriptif
          const descriptifParse = parseDescriptif(transaction.descriptif_brut, transaction.reference);
          allDescriptifs.push(descriptifParse);
        });
      }

      setResults({
        transactions: allTransactions,
        descriptifs: allDescriptifs
      });

    } catch (err) {
      console.error('Erreur lors du traitement:', err);
      setError('Erreur lors du traitement des fichiers. Vérifiez que les PDF contiennent des relevés bancaires valides.');
    } finally {
      setProcessing(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
      reader.readAsDataURL(file);
    });
  };

  const parseDescriptif = (descriptifBrut, reference) => {
    // Mots répétitifs de banque à filtrer
    const motsBanque = [
      'virement', 'versement', 'retrait', 'prelevement', 'commission', 'frais',
      'carte', 'cheque', 'especes', 'tpe', 'dab', 'guichet', 'automatique',
      'bancaire', 'compte', 'solde', 'credit', 'debit', 'operation',
      'transaction', 'virmt', 'virst', 'prlv', 'comm', 'agios'
    ];

    // Nettoyer le descriptif
    let descriptifClean = descriptifBrut.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Séparer les mots
    const mots = descriptifClean.split(' ');
    
    // Filtrer les mots de banque
    const motsFiltres = mots.filter(mot => 
      mot.length > 2 && 
      !motsBanque.some(motBanque => mot.includes(motBanque)) &&
      !/^\d+$/.test(mot) // Exclure les nombres purs
    );

    // Identifier le nom du client (généralement les premiers mots significatifs)
    const nomClient = motsFiltres.slice(0, 3).join(' ');
    
    // Mots clés restants
    const motsCles = motsFiltres.slice(3).join(' ');

    return {
      reference,
      descriptif_brut: descriptifBrut,
      nom_client: nomClient || 'Non identifié',
      mots_cles: motsCles || '',
      descriptif_nettoye: motsFiltres.join(' ')
    };
  };

  const downloadCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return `"${value || ''}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Processeur de Relevés Bancaires Marocains
          </h1>
          <p className="text-gray-600">
            Uploadez vos relevés PDF pour extraire et analyser les transactions bancaires
          </p>
        </header>

        {/* Zone d'upload */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" />
            Upload des fichiers PDF
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                Cliquez pour sélectionner vos relevés PDF
              </p>
              <p className="text-sm text-gray-500">
                Formats acceptés: PDF uniquement
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Fichiers sélectionnés:</h3>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <FileText className="mr-2 h-4 w-4" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bouton de traitement */}
        <div className="text-center mb-6">
          <button
            onClick={processFiles}
            disabled={processing || files.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Traiter les relevés
              </>
            )}
          </button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Résultats */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-500" />
              Traitement terminé
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Fichier principal */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Fichier principal des transactions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {results.transactions.length} transactions trouvées
                </p>
                <button
                  onClick={() => downloadCSV(results.transactions, 'transactions_bancaires.csv')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger CSV
                </button>
              </div>

              {/* Fichier descriptifs */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Fichier des descriptifs parsés</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Noms clients et mots-clés extraits
                </p>
                <button
                  onClick={() => downloadCSV(results.descriptifs, 'descriptifs_parse.csv')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger CSV
                </button>
              </div>
            </div>

            {/* Aperçu des données */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Aperçu des premières transactions:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left">Date valeur</th>
                      <th className="px-2 py-1 text-left">Débit</th>
                      <th className="px-2 py-1 text-left">Crédit</th>
                      <th className="px-2 py-1 text-left">Référence</th>
                      <th className="px-2 py-1 text-left">Banque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.transactions.slice(0, 5).map((transaction, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-2 py-1">{transaction.date_valeur}</td>
                        <td className="px-2 py-1 text-red-600">{transaction.debit || '-'}</td>
                        <td className="px-2 py-1 text-green-600">{transaction.credit || '-'}</td>
                        <td className="px-2 py-1">{transaction.reference}</td>
                        <td className="px-2 py-1">{transaction.banque}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions d'utilisation</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. <strong>Sélectionnez vos fichiers PDF</strong> - Relevés bancaires des banques marocaines</p>
            <p>2. <strong>Lancez le traitement</strong> - L'IA analysera automatiquement les documents</p>
            <p>3. <strong>Téléchargez les résultats</strong> - Deux fichiers CSV seront générés:</p>
            <ul className="ml-6 space-y-1">
              <li>• <strong>transactions_bancaires.csv</strong> - Données principales avec colonnes: Date valeur, Date opération, Débit, Crédit, Référence, Banque, Descriptif</li>
              <li>• <strong>descriptifs_parse.csv</strong> - Descriptifs analysés avec: Référence, Nom client, Mots-clés, Descriptif nettoyé</li>
            </ul>
            <p>4. <strong>Liaison des fichiers</strong> - Utilisez la colonne "Référence" pour faire le lien entre les deux CSV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankStatementProcessor;
