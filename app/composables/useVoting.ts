export interface VoteOption {
  id: string
  name: string
  description: string
  image1: string
  image2: string
  votes: number
}

export interface UserVote {
  optionId: string
  points: number
}

export const useVoting = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const getVoteOptions = async (): Promise<VoteOption[]> => {
    try {
      const response = await $fetch<VoteOption[]>(`${apiBaseUrl}/obtorta/herd/vote-options`)
      return response
    } catch (error) {
      console.error('Error fetching vote options:', error)
      throw error
    }
  }

  const submitVotes = async (votes: UserVote[]): Promise<void> => {
    try {
      await $fetch(`${apiBaseUrl}/obtorta/herd/votes`, {
        method: 'POST',
        body: { votes }
      })
    } catch (error) {
      console.error('Error submitting votes:', error)
      throw error
    }
  }

  const getVoteResults = async (): Promise<VoteOption[]> => {
    try {
      const response = await $fetch<VoteOption[]>(`${apiBaseUrl}/obtorta/herd/vote-results`)
      return response
    } catch (error) {
      console.error('Error fetching vote results:', error)
      throw error
    }
  }

  return {
    getVoteOptions,
    submitVotes,
    getVoteResults
  }
}
