import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="inline-flex items-center gap-0.5" [class.cursor-pointer]="!readonly()">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <svg
          class="transition-colors duration-150"
          [class.w-4.h-4]="size() === 'sm'"
          [class.w-5.h-5]="size() === 'md' || !size()"
          [class.w-6.h-6]="size() === 'lg'"
          [class.cursor-pointer]="!readonly()"
          [class.text-yellow-400]="star <= hoverValue()"
          [class.fill-yellow-400]="star <= hoverValue()"
          [class.text-neutral-300]="star > hoverValue()"
          [class.dark:text-neutral-600]="star > hoverValue()"
          viewBox="0 0 20 20"
          fill="currentColor"
          (mouseenter)="onHover(star)"
          (mouseleave)="onLeave()"
          (click)="onClick(star)"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      }
    </div>
  `,
})
export class StarRatingComponent {
  readonly value = input<number>(0);
  readonly readonly = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly valueChange = output<number>();

  protected hoverValue = signal<number>(0);

  onHover(star: number): void {
    if (this.readonly()) return;
    this.hoverValue.set(star);
  }

  onLeave(): void {
    this.hoverValue.set(0);
  }

  onClick(star: number): void {
    if (this.readonly()) return;
    this.valueChange.emit(star);
  }
}
