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
                'description' => 'Site web moderne développé avec Symfony et technologies web avancées',
                'image' => '/images/project1.jpg',
                'technologies' => ['Symfony', 'PHP', 'Twig', 'Sass', 'Docker'],
                'github' => 'https://github.com/florian0503/GoldenGoat2',
                'demo' => 'https://goldengoat.fr'
            ],
            [
                'title' => 'Barbershop Lyon',
                'description' => 'Site web professionnel pour salon de coiffure avec interface moderne',
                'image' => '/images/project2.jpg',
                'technologies' => ['Symfony', 'PHP', 'Twig', 'Sass'],
                'github' => 'https://github.com/florian0503/ChrisBarberCDA',
                'demo' => 'https://barbershoplyon.com'
            ],
            [
                'title' => 'Dashboard Analytics',
                'description' => 'Dashboard interactif avec graphiques en temps réel et data visualization',
                'image' => '/images/project3.jpg',
                'technologies' => ['Vue.js', 'Chart.js', 'Laravel', 'Redis'],
                'github' => 'https://github.com/votre-username/dashboard',
                'demo' => 'https://dashboard-demo.com'
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
