<template>
  <div class="flex w-[900px] h-[900px]">
      <img
        :src="member.image3d"
        :alt="member.name"
        class="w-full transition-all duration-500"
        @error="handleImageError"
      />
      <div>
      <div class="pt-32 w-128">
      <h3 class="text-3xl font-extrabold mb-3" style="color: var(--color-secondary);">{{ member.name }}</h3>
      <p class="text-2xl font-bold mb-4 uppercase tracking-wide" style="color: var(--color-accent); filter: brightness(1.5);">
        {{ member.role }}
      </p>
      <p class="text-base leading-relaxed font-medium" style="color: var(--color-accent);">
        {{ member.bio }}
      </p>
      <div>
        <h3 class="text-3xl font-extrabold mb-3" style="color: var(--color-secondary);">Le vélo de {{ member.name }}</h3>
        <img :src="member.velo" :alt="member.name" class="w-96 object-cover transition-all duration-500" />
      </div>
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