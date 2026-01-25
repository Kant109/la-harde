<template>
  <div class="flex flex-col md:flex-row w-full md:w-[900px] md:h-[900px] md:mt-48">
    <!-- Image 3D - à gauche sur mobile et desktop -->
    <img
      :src="member.image3d"
      :alt="member.name"
      class="w-1/2 md:w-48 h-auto md:h-96 object-cover md:mt-36 md:mx-28 transition-all duration-500"
      @error="handleImageError"
    />
    
    <!-- Contenu à droite -->
    <div class="flex flex-col w-full md:w-auto px-4 py-6 md:px-8 md:pt-32">
      <!-- Informations du membre -->
      <div class="mb-6">
        <h3 class="text-lg md:text-xl font-extrabold mb-3" style="color: var(--color-secondary);">
          {{ member.name }}
        </h3>
        <p class="text-lg md:text-xl font-bold mb-4 uppercase tracking-wide" style="color: var(--color-accent); filter: brightness(1.5);">
          {{ member.role }}
        </p>
        <p class="text-base leading-relaxed font-medium" style="color: var(--color-accent);">
          {{ member.bio }}
        </p>
      </div>
      
      <!-- Vélo -->
      <div>
        <h3 class="text-lg md:text-xl font-extrabold mb-3" style="color: var(--color-secondary);">
          Le vélo de {{ member.name }}
        </h3>
        <img 
          :src="member.velo" 
          :alt="member.name" 
          class="w-1/2 md:w-60 h-auto object-cover transition-all duration-500" 
        />
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
  image3d?: string
  velo?: string
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