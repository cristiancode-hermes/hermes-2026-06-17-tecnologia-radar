import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div
      class="rounded-full bg-primary-500 text-white flex items-center justify-center font-medium select-none"
      [class.w-8.h-8.text-sm]="size() === 'sm'"
      [class.w-10.h-10.text-base]="size() === 'md' || !size()"
      [class.w-12.h-12.text-lg]="size() === 'lg'"
      [title]="name()"
    >
      {{ initials() }}
    </div>
  `,
})
export class AvatarComponent {
  readonly name = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });
}
