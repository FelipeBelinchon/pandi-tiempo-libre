import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'app-root', standalone: true, imports: [],
  templateUrl: './app.component.html', styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    this.element.nativeElement.querySelectorAll<HTMLElement>(
      '.section-heading, .camp-card, .essence > h2, .value-cards article, .method > div, .family article, .contact > div'
    ).forEach(element => {
      // Content already on screen stays visible; reveal only lower sections.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('scroll-reveal');
      this.observer?.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  title = 'pandi-tiempo-libre';
  menuOpen = false;
  activeCategory = 'Multiaventura';
  categories = ['Multiaventura', 'Deporte', 'Creatividad', 'En grupo'];
  activities: Record<string, string[]> = {
    'Multiaventura': ['Parque de cuerdas y tirolina', 'Kayak y tiro con arco', 'Senderismo y orientación', 'Bicis y excursiones'],
    'Deporte': ['Fútbol', 'Baloncesto', 'Atletismo', 'Tenis'],
    'Creatividad': ['Arte', 'Baile', 'Cocina', 'Actividades culturales'],
    'En grupo': ['Juegos en equipo', 'Fiestas temáticas', 'Observación de estrellas', 'Acampada']
  };
}


