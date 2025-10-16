<template>
  <div class="card group cursor-pointer">
    <!-- Image -->
    <div class="relative overflow-hidden h-64">
      <img
        :src="member.image"
        :alt="member.name"
        class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        @error="handleImageError"
      />
      <div class="absolute inset-0 transition-all duration-300 group-hover:opacity-100 opacity-0" style="background: linear-gradient(to top, var(--color-primary), transparent);"></div>

      <!-- Spécialité en overlay -->
      <div class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
        <p class="text-base font-bold" style="color: var(--color-secondary);">{{ member.speciality }}</p>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <h3 class="text-3xl font-extrabold mb-3" style="color: var(--color-secondary);">{{ member.name }}</h3>
      <p class="text-base font-bold mb-4 uppercase tracking-wide" style="color: var(--color-accent); filter: brightness(1.5);">
        {{ member.role }}
      </p>
      <p class="text-base leading-relaxed font-medium" style="color: var(--color-accent);">
        {{ member.bio }}
      </p>

      <!-- Badge animé -->
      <div class="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold" style="background-color: var(--color-secondary); color: var(--color-background);">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#DBD2C3">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span style="color: var(--color-primary);">Sanglier Explosif</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  image: string
  speciality: string
}

defineProps<{
  member: TeamMember
}>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/400x400/3B2F2F/CDA434?text=' + encodeURIComponent('LA HARDE')
}
</script>
