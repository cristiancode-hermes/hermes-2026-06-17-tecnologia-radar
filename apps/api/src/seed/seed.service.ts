import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Technology } from '../technologies/technology.entity';
import { Vote } from '../votes/vote.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Technology)
    private technologiesRepository: Repository<Technology>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async onApplicationBootstrap() {
    const existingUsers = await this.usersRepository.count();
    if (existingUsers > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await this.usersRepository.save({
      email: 'admin@radar.dev',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    });

    const user = await this.usersRepository.save({
      email: 'user@radar.dev',
      password: userPassword,
      name: 'Demo User',
      role: 'user',
    });

    // Create categories
    const categoriesData = [
      { name: 'Frontend', description: 'Frontend web technologies', color: '#6366f1' },
      { name: 'Backend', description: 'Backend server technologies', color: '#22c55e' },
      { name: 'DevOps', description: 'DevOps and infrastructure', color: '#f97316' },
      { name: 'Mobile', description: 'Mobile development frameworks', color: '#8b5cf6' },
      { name: 'AI/ML', description: 'Artificial intelligence and machine learning', color: '#ec4899' },
      { name: 'Tools', description: 'Development tools and editors', color: '#14b8a6' },
      { name: 'Database', description: 'Database technologies', color: '#eab308' },
      { name: 'Cloud', description: 'Cloud computing platforms', color: '#3b82f6' },
    ];

    const categories = await this.categoriesRepository.save(categoriesData);

    // Create technologies
    const technologiesData = [
      // Frontend
      { name: 'React', description: 'A JavaScript library for building user interfaces', categoryId: categories[0].id, websiteUrl: 'https://react.dev' },
      { name: 'Angular', description: 'A platform for building mobile and desktop web applications', categoryId: categories[0].id, websiteUrl: 'https://angular.io' },
      { name: 'Vue.js', description: 'A progressive framework for building user interfaces', categoryId: categories[0].id, websiteUrl: 'https://vuejs.org' },
      { name: 'Svelte', description: 'A cybernetic approach to building web apps', categoryId: categories[0].id, websiteUrl: 'https://svelte.dev' },
      { name: 'Solid.js', description: 'A declarative JavaScript library for building user interfaces', categoryId: categories[0].id, websiteUrl: 'https://solidjs.com' },
      // Backend
      { name: 'NestJS', description: 'A progressive Node.js framework for building efficient server-side applications', categoryId: categories[1].id, websiteUrl: 'https://nestjs.com' },
      { name: 'Express', description: 'Fast, unopinionated, minimalist web framework for Node.js', categoryId: categories[1].id, websiteUrl: 'https://expressjs.com' },
      { name: 'Fastify', description: 'Fast and low overhead web framework for Node.js', categoryId: categories[1].id, websiteUrl: 'https://fastify.io' },
      { name: 'Django', description: 'A high-level Python web framework', categoryId: categories[1].id, websiteUrl: 'https://djangoproject.com' },
      { name: 'Ruby on Rails', description: 'A server-side web application framework written in Ruby', categoryId: categories[1].id, websiteUrl: 'https://rubyonrails.org' },
      // DevOps
      { name: 'Docker', description: 'A platform for developing, shipping, and running applications', categoryId: categories[2].id, websiteUrl: 'https://docker.com' },
      { name: 'Kubernetes', description: 'An orchestration system for containerized applications', categoryId: categories[2].id, websiteUrl: 'https://kubernetes.io' },
      { name: 'Terraform', description: 'An infrastructure as code tool', categoryId: categories[2].id, websiteUrl: 'https://terraform.io' },
      { name: 'Ansible', description: 'An automation engine for configuration management', categoryId: categories[2].id, websiteUrl: 'https://ansible.com' },
      { name: 'GitHub Actions', description: 'Automate workflows with CI/CD pipelines', categoryId: categories[2].id, websiteUrl: 'https://github.com/features/actions' },
      // Mobile
      { name: 'Flutter', description: 'A UI toolkit for building natively compiled applications', categoryId: categories[3].id, websiteUrl: 'https://flutter.dev' },
      { name: 'React Native', description: 'A framework for building native apps using React', categoryId: categories[3].id, websiteUrl: 'https://reactnative.dev' },
      { name: 'SwiftUI', description: 'An innovative way to build user interfaces across all Apple platforms', categoryId: categories[3].id, websiteUrl: 'https://developer.apple.com/swiftui' },
      { name: 'Kotlin Multiplatform', description: 'Share business logic across mobile platforms', categoryId: categories[3].id, websiteUrl: 'https://kotlinlang.org' },
      // AI/ML
      { name: 'TensorFlow', description: 'An end-to-end open source machine learning platform', categoryId: categories[4].id, websiteUrl: 'https://tensorflow.org' },
      { name: 'PyTorch', description: 'An open source machine learning framework', categoryId: categories[4].id, websiteUrl: 'https://pytorch.org' },
      { name: 'LangChain', description: 'A framework for developing LLM-powered applications', categoryId: categories[4].id, websiteUrl: 'https://langchain.com' },
      { name: 'Hugging Face', description: 'A platform for machine learning and AI models', categoryId: categories[4].id, websiteUrl: 'https://huggingface.co' },
      // Tools
      { name: 'VS Code', description: 'A source-code editor made by Microsoft', categoryId: categories[5].id, websiteUrl: 'https://code.visualstudio.com' },
      { name: 'WebStorm', description: 'A powerful IDE for JavaScript and TypeScript', categoryId: categories[5].id, websiteUrl: 'https://jetbrains.com/webstorm' },
      { name: 'Figma', description: 'A collaborative interface design tool', categoryId: categories[5].id, websiteUrl: 'https://figma.com' },
      { name: 'Linear', description: 'A project management tool for software teams', categoryId: categories[5].id, websiteUrl: 'https://linear.app' },
      // Database
      { name: 'PostgreSQL', description: 'A powerful, open source object-relational database', categoryId: categories[6].id, websiteUrl: 'https://postgresql.org' },
      { name: 'MongoDB', description: 'A document-oriented NoSQL database', categoryId: categories[6].id, websiteUrl: 'https://mongodb.com' },
      { name: 'Redis', description: 'An in-memory data structure store', categoryId: categories[6].id, websiteUrl: 'https://redis.io' },
      { name: 'SQLite', description: 'A C-language library that implements a SQL database engine', categoryId: categories[6].id, websiteUrl: 'https://sqlite.org' },
      // Cloud
      { name: 'AWS', description: 'Amazon Web Services cloud computing platform', categoryId: categories[7].id, websiteUrl: 'https://aws.amazon.com' },
      { name: 'Google Cloud', description: 'Google Cloud Platform for building and hosting applications', categoryId: categories[7].id, websiteUrl: 'https://cloud.google.com' },
      { name: 'Azure', description: 'Microsoft Azure cloud computing platform', categoryId: categories[7].id, websiteUrl: 'https://azure.microsoft.com' },
      { name: 'Cloudflare', description: 'A global cloud connectivity platform', categoryId: categories[7].id, websiteUrl: 'https://cloudflare.com' },
    ];

    const technologies = await this.technologiesRepository.save(technologiesData);

    // Create sample votes
    const voteData = [
      // Admin votes
      { userId: admin.id, technologyId: technologies[0].id, score: 5, comment: 'Excellent for UI development' },
      { userId: admin.id, technologyId: technologies[1].id, score: 4, comment: 'Great framework for enterprise apps' },
      { userId: admin.id, technologyId: technologies[5].id, score: 5, comment: 'The best Node.js framework' },
      { userId: admin.id, technologyId: technologies[10].id, score: 5, comment: 'Essential for any project' },
      { userId: admin.id, technologyId: technologies[11].id, score: 4, comment: 'Powerful but complex' },
      { userId: admin.id, technologyId: technologies[19].id, score: 5, comment: 'Revolutionary for AI development' },
      { userId: admin.id, technologyId: technologies[20].id, score: 4, comment: 'Great for research' },
      { userId: admin.id, technologyId: technologies[24].id, score: 5, comment: 'Best code editor' },
      { userId: admin.id, technologyId: technologies[28].id, score: 5, comment: 'My go-to database' },
      { userId: admin.id, technologyId: technologies[32].id, score: 4, comment: 'Market leader for cloud' },
      { userId: admin.id, technologyId: technologies[3].id, score: 3, comment: 'Interesting but niche' },
      { userId: admin.id, technologyId: technologies[15].id, score: 4, comment: 'Cross-platform done right' },
      { userId: admin.id, technologyId: technologies[26].id, score: 3, comment: 'Good design tool' },
      { userId: admin.id, technologyId: technologies[30].id, score: 4, comment: 'Fast caching solution' },
      // User votes
      { userId: user.id, technologyId: technologies[0].id, score: 4, comment: 'Great ecosystem' },
      { userId: user.id, technologyId: technologies[2].id, score: 5, comment: 'Love Vue.js simplicity' },
      { userId: user.id, technologyId: technologies[5].id, score: 4, comment: 'Clean architecture' },
      { userId: user.id, technologyId: technologies[6].id, score: 3, comment: 'Simple but limited' },
      { userId: user.id, technologyId: technologies[10].id, score: 4, comment: 'Makes deployment easy' },
      { userId: user.id, technologyId: technologies[14].id, score: 3, comment: 'Good for automation' },
      { userId: user.id, technologyId: technologies[16].id, score: 4, comment: 'Works well cross-platform' },
      { userId: user.id, technologyId: technologies[21].id, score: 5, comment: 'Amazing for AI apps' },
      { userId: user.id, technologyId: technologies[27].id, score: 3, comment: 'Solid DB' },
      { userId: user.id, technologyId: technologies[31].id, score: 4, comment: 'Good cloud provider' },
      { userId: user.id, technologyId: technologies[4].id, score: 2, comment: 'Too early to adopt' },
      { userId: user.id, technologyId: technologies[8].id, score: 4, comment: 'Python web dev at its best' },
      { userId: user.id, technologyId: technologies[12].id, score: 3, comment: 'Getting better' },
      { userId: user.id, technologyId: technologies[22].id, score: 4, comment: 'Great model hub' },
      { userId: user.id, technologyId: technologies[25].id, score: 3, comment: 'Nice design tool' },
      { userId: user.id, technologyId: technologies[29].id, score: 5, comment: 'Best NoSQL DB' },
    ];

    await this.votesRepository.save(voteData);

    // Recalculate scores for all technologies
    for (const tech of technologies) {
      const votes = await this.votesRepository.find({
        where: { technologyId: tech.id },
      });
      const totalScore = votes.reduce((sum, v) => sum + v.score, 0);
      tech.avgScore = votes.length > 0 ? totalScore / votes.length : 0;
      tech.voteCount = votes.length;
    }
    await this.technologiesRepository.save(technologies);

    console.log('Database seeded successfully!');
  }
}
