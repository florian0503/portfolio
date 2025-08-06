<?php

namespace App\Controller;

use App\Entity\ContactMessage;
use App\Repository\ContactMessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class PortfolioController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        $projects = [
            [
                'title' => 'Golden Goat',
                'description' => 'GoldenGoat est une application web sociale dédiée aux passionnés de football, permettant aux utilisateurs de voter pour leurs joueurs préférés, créer des classements personnalisés et débattre autour de l’actualité du foot. J’ai conçu l’architecture complète du projet, en modélisant les entités et les relations avec Doctrine, et en développant un backend robuste sous Symfony. J’ai mis en place une authentification sécurisée via Google OAuth, ainsi qu’un système de gestion des rôles et de permissions utilisateurs. Le système de vote (notation, classement) a été entièrement développé sur mesure.L’interface, construite avec Twig, Bootstrap et Sass en BEM, est responsive et pensée pour offrir une expérience utilisateur fluide. Un back-office complet a été mis en place avec EasyAdmin pour permettre une gestion efficace des données. Enfin, le projet est conteneurisé avec Docker et utilise Webpack Encore pour une gestion optimisée des assets.',
                'image' => '/images/project1.jpg',
                'technologies' => ['Symfony', 'PHP', 'Twig', 'Sass', 'Docker', 'Doctrine ', 'Bootstrap ', 'EasyAdmin ', 'Webpack Encore', 'GitHub', 'Authentification Google'],
                'github' => 'https://github.com/florian0503/GoldenGoat2',
                'prod' => 'https://goldengoat.fr'
            ],
            [
                'title' => 'Barbershop Lyon',
                'description' => 'Barbershop est une plateforme en ligne dédiée à la gestion de rendez-vous pour salons de coiffure, avec un focus sur la simplicité et l’efficacité pour les professionnels comme pour les clients. J’ai développé l’application en m’appuyant sur Symfony pour le backend, en créant une architecture claire et évolutive. Le système de réservation permet aux utilisateurs de consulter les créneaux disponibles, de réserver un créneau, de recevoir une confirmation, et aux barbiers de gérer leur planning depuis un back-office personnalisé. L’interface utilisateur a été conçue avec Twig, Bootstrap et Sass en BEM, pour un design responsive et élégant. J’ai aussi intégré un système d’authentification, la gestion des rôles (admin / coiffeur / client) et un tableau de bord permettant une vision claire des rendez-vous. Enfin, Webpack Encore a été utilisé pour optimiser les assets, avec une organisation de code propre et maintenable.',
                'image' => '/images/project2.jpg',
                'technologies' => ['Symfony', 'PHP', 'Twig', 'Sass (BEM)', 'Bootstrap', 'EasyAdmin', 'Stripe'],
                'github' => 'https://github.com/florian0503/ChrisBarberCDA',
                'prod' => 'https://barbershoplyon.com'
            ],
            [
                'title' => 'Vide ton grenier',
                'description' => 'VideTonGrenier est une plateforme web que j’ai entièrement développée, permettant aux particuliers de déposer des annonces pour vendre ou donner des objets d’occasion, dans un esprit de vide-grenier numérique local. Le site propose un système de dépôt d’annonces simple et intuitif : l’utilisateur choisit une catégorie, ajoute un titre, une description, un prix, une image, et soumet son annonce. Celle-ci est ensuite visible dans le back-office, où un administrateur peut la valider ou la refuser. J’ai mis en place un système de recherche avancée, combinant mots-clés, filtres par catégories, et tri dynamique par prix, date ou pertinence, pour permettre aux visiteurs de naviguer efficacement parmi les annonces. Un système de signalement est également disponible : si un contenu pose problème, il peut être signalé et apparaît automatiquement dans l’interface d’administration. Depuis ce back-office complet, l’admin peut modérer les annonces, gérer les signalements, bannir ou débannir des comptes, et suivre les échanges entre utilisateurs grâce à un accès aux messages. L’interface a été développée en Twig avec une structure Sass en BEM, et s’appuie sur Bootstrap pour un rendu responsive. Le projet repose sur le framework Symfony, avec Webpack Encore pour la gestion des assets, assurant des performances optimales et une structure de code maintenable.',
                'image' => '/images/project3.jpg',
                'technologies' => ['Symfony', 'Doctrine', 'Twig', 'Scss', 'Bootstrap', 'EasyAdmin', 'Gestion de fichiers', 'MySQL', 'GitHub', ],
                'github' => 'https://github.com/florian0503/VideTonGrenier',
                'prod' => 'http://videtongrenier.eu'
            ]
        ];

        $skills = [
            ['name' => 'PHP/Symfony', 'level' => 90],
            ['name' => 'JavaScript', 'level' => 85],
            ['name' => 'Sass', 'level' => 80],
            ['name' => 'Twig', 'level' => 85],
            ['name' => 'Flutter/Dart', 'level' => 75],
            ['name' => 'Git/GitHub', 'level' => 85]
        ];

        return $this->render('portfolio/index.html.twig', [
            'projects' => $projects,
            'skills' => $skills,
            'name' => 'Florian DIMBERT',
            'title' => 'Développeur Full Stack',
            'description' => 'Passionné par le développement web moderne, je crée des applications performantes et élégantes avec les dernières technologies.'
        ]);
    }

    #[Route('/contact', name: 'app_contact', methods: ['POST'])]
    public function contact(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Basic validation
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            return new JsonResponse(['success' => false, 'message' => 'Tous les champs sont requis.'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['success' => false, 'message' => 'Email invalide.'], 400);
        }

        // Save message to database
        try {
            $contactMessage = new ContactMessage();
            $contactMessage->setName($data['name']);
            $contactMessage->setEmail($data['email']);
            $contactMessage->setSubject($data['subject'] ?? null);
            $contactMessage->setMessage($data['message']);
            
            $entityManager->persist($contactMessage);
            $entityManager->flush();
            
            return new JsonResponse([
                'success' => true, 
                'message' => 'Merci pour votre message ! Il a été enregistré et je vous répondrai bientôt.'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false, 
                'message' => 'Erreur lors de l\'enregistrement du message. Veuillez réessayer.'
            ], 500);
        }
    }
}
