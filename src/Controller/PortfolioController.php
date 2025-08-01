<?php

namespace App\Controller;

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
                'title' => 'E-commerce Platform',
                'description' => 'Plateforme e-commerce moderne avec Symfony 7, React et PostgreSQL',
                'image' => '/images/project1.jpg',
                'technologies' => ['Symfony', 'React', 'PostgreSQL', 'Docker'],
                'github' => 'https://github.com/votre-username/ecommerce',
                'demo' => 'https://demo-ecommerce.com'
            ],
            [
                'title' => 'API REST Portfolio',
                'description' => 'API REST complète avec authentification JWT et documentation Swagger',
                'image' => '/images/project2.jpg',
                'technologies' => ['PHP', 'API Platform', 'JWT', 'MySQL'],
                'github' => 'https://github.com/votre-username/api-portfolio',
                'demo' => 'https://api-portfolio.com'
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
            ['name' => 'JavaScript/TypeScript', 'level' => 85],
            ['name' => 'React/Vue.js', 'level' => 80],
            ['name' => 'MySQL/PostgreSQL', 'level' => 75],
            ['name' => 'Docker/DevOps', 'level' => 70],
            ['name' => 'Git/GitHub', 'level' => 85]
        ];

        return $this->render('portfolio/index.html.twig', [
            'projects' => $projects,
            'skills' => $skills,
            'name' => 'Votre Nom',
            'title' => 'Développeur Full Stack',
            'description' => 'Passionné par le développement web moderne, je crée des applications performantes et élégantes avec les dernières technologies.'
        ]);
    }

    #[Route('/contact', name: 'app_contact', methods: ['POST'])]
    public function contact(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Basic validation
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            return new JsonResponse(['success' => false, 'message' => 'Tous les champs sont requis.'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['success' => false, 'message' => 'Email invalide.'], 400);
        }

        // Here you would typically send an email or save to database
        // For demo purposes, we'll just return success
        
        return new JsonResponse([
            'success' => true, 
            'message' => 'Merci pour votre message ! Je vous répondrai bientôt.'
        ]);
    }
}
