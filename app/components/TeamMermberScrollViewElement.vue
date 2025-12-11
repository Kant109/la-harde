<template>
  <div class="flex w-[400px] h-[1000px]">
      <img
        :src="member.image"
        :alt="member.name"
        class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        @error="handleImageError"
      />
      <div>
      <div class="pt-32 w-64">
      <h3 class="text-3xl font-extrabold mb-3" style="color: var(--color-secondary);">{{ member.name }}</h3>
      <p class="text-2xl font-bold mb-4 uppercase tracking-wide" style="color: var(--color-accent); filter: brightness(1.5);">
        {{ member.role }}
      </p>
      <p class="text-base leading-relaxed font-medium" style="color: var(--color-accent);">
        {{ member.bio }}
      </p>
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