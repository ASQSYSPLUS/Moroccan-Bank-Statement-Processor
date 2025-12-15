#!/bin/bash

# Script de gestion du Processeur de Relevés Bancaires avec Podman
# Facilite les opérations courantes

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IMAGE_NAME="processeur-bancaire"
CONTAINER_NAME="processeur-bancaire"
PORT="8080"

# Fonction d'affichage du menu
show_menu() {
    echo -e "${BLUE}=================================${NC}"
    echo -e "${BLUE}  Processeur Relevés Bancaires${NC}"
    echo -e "${BLUE}=================================${NC}"
    echo ""
    echo "1) Construire l'image"
    echo "2) Démarrer l'application"
    echo "3) Arrêter l'application"
    echo "4) Redémarrer l'application"
    echo "5) Voir les logs"
    echo "6) Voir les logs en temps réel"
    echo "7) Supprimer le conteneur"
    echo "8) Reconstruire complètement"
    echo "9) Voir l'état du conteneur"
    echo "10) Ouvrir dans le navigateur"
    echo "0) Quitter"
    echo ""
}

# Construction de l'image
build() {
    echo -e "${YELLOW}Construction de l'image...${NC}"
    podman build -t ${IMAGE_NAME}:latest .
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Image construite avec succès !${NC}"
    else
        echo -e "${RED}✗ Erreur lors de la construction${NC}"
        exit 1
    fi
}

# Démarrage de l'application
start() {
    # Vérifier si le conteneur existe déjà
    if podman ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${YELLOW}Le conteneur existe déjà. Démarrage...${NC}"
        podman start ${CONTAINER_NAME}
    else
        echo -e "${YELLOW}Création et démarrage du conteneur...${NC}"
        podman run -d -p ${PORT}:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application démarrée !${NC}"
        echo -e "${GREEN}  Accédez à: http://localhost:${PORT}${NC}"
    else
        echo -e "${RED}✗ Erreur lors du démarrage${NC}"
        exit 1
    fi
}

# Arrêt de l'application
stop() {
    echo -e "${YELLOW}Arrêt de l'application...${NC}"
    podman stop ${CONTAINER_NAME}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application arrêtée${NC}"
    else
        echo -e "${RED}✗ Erreur lors de l'arrêt${NC}"
    fi
}

# Redémarrage
restart() {
    echo -e "${YELLOW}Redémarrage de l'application...${NC}"
    podman restart ${CONTAINER_NAME}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application redémarrée${NC}"
        echo -e "${GREEN}  Accédez à: http://localhost:${PORT}${NC}"
    else
        echo -e "${RED}✗ Erreur lors du redémarrage${NC}"
    fi
}

# Affichage des logs
logs() {
    echo -e "${BLUE}Logs de l'application:${NC}"
    echo ""
    podman logs ${CONTAINER_NAME}
}

# Logs en temps réel
logs_follow() {
    echo -e "${BLUE}Logs en temps réel (Ctrl+C pour arrêter):${NC}"
    echo ""
    podman logs -f ${CONTAINER_NAME}
}

# Suppression du conteneur
remove() {
    echo -e "${YELLOW}Suppression du conteneur...${NC}"
    podman rm -f ${CONTAINER_NAME}
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Conteneur supprimé${NC}"
    else
        echo -e "${RED}✗ Erreur lors de la suppression${NC}"
    fi
}

# Reconstruction complète
rebuild() {
    echo -e "${YELLOW}Reconstruction complète...${NC}"
    remove
    build
    start
}

# État du conteneur
status() {
    echo -e "${BLUE}État du conteneur:${NC}"
    echo ""
    podman ps -a --filter name=${CONTAINER_NAME}
    echo ""
    echo -e "${BLUE}Utilisation des ressources:${NC}"
    podman stats --no-stream ${CONTAINER_NAME} 2>/dev/null || echo "Conteneur non actif"
}

# Ouvrir dans le navigateur
open_browser() {
    URL="http://localhost:${PORT}"
    echo -e "${GREEN}Ouverture de ${URL}...${NC}"
    
    # Détection du système d'exploitation
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open ${URL}
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open ${URL}
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        start ${URL}
    else
        echo -e "${YELLOW}Ouvrez manuellement: ${URL}${NC}"
    fi
}

# Boucle principale
while true; do
    show_menu
    read -p "Choisissez une option: " choice
    echo ""
    
    case $choice in
        1) build ;;
        2) start ;;
        3) stop ;;
        4) restart ;;
        5) logs ;;
        6) logs_follow ;;
        7) remove ;;
        8) rebuild ;;
        9) status ;;
        10) open_browser ;;
        0) echo -e "${GREEN}Au revoir !${NC}"; exit 0 ;;
        *) echo -e "${RED}Option invalide${NC}" ;;
    esac
    
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
    clear
done
