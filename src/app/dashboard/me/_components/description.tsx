'use client'

import { debounce } from 'lodash'
import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import changeDescription from '../_actions/change-description'

export default function Description({
  InitialDescription,
}: {
  InitialDescription: string
}) {
  const [description, setDescription] = useState(InitialDescription)
  const [originalDescription] = useState(InitialDescription)

  const debouncedSaveDescription = useRef(
    debounce(async (currentDescription: string) => {
      if (currentDescription.trim() === '') {
        setDescription(originalDescription)
      }

      if (currentDescription !== description) {
        try {
          const response = await changeDescription({
            description: currentDescription,
          })

          if (response.error) {
            console.log('Error updating description:', response.error)
            toast.error(response.error)
            setDescription(originalDescription)
            return
          }

          console.log('Bio atualizada com sucesso:', response.data)
          toast.success('Bio atualizada com sucesso!')
        } catch (error) {
          console.log('Error updating bio:', error)
          setDescription(originalDescription)
        }
      }
    }, 500),
  ).current

  function handleChangeDescription(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setDescription(value)
    debouncedSaveDescription(value)
  }

  return (
    <textarea
      className="text-base bg-gray-100 border border-gray-100 rounded-md outline-none p-2 w-full max-w-2xl text-center my-3 h-40 resize-none"
      value={description}
      onChange={handleChangeDescription}
    />
  )
}
