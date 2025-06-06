'use client'

import { debounce } from 'lodash'
import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import changeName from '../_actions/change-name'

export default function Name({ InitialName }: { InitialName: string }) {
  const [name, setName] = useState(InitialName)
  const [originalName] = useState(InitialName)

  const debouncedSaveName = useRef(
    debounce(async (currentName: string) => {
      if (currentName.trim() === '') {
        setName(originalName)
      }

      if (currentName !== name) {
        try {
          const response = await changeName({ name: currentName })

          if (response.error) {
            console.log('Error updating name:', response.error)
            toast.error(response.error)
            setName(originalName)
            return
          }

          console.log('Nome atualizado com sucesso:', response.data)
          toast.success('Nome atualizado com sucesso!')
        } catch (error) {
          console.log('Error updating name:', error)
          setName(originalName)
        }
      }
    }, 500),
  ).current

  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
    debouncedSaveName(value)
  }

  return (
    <input
      className="text-xl md:text-2xl font-bold bg-gray-100 border border-gray-100 rounded-md outline-none p-2 w-full max-w-2xl text-center my-3"
      value={name}
      onChange={handleChangeName}
    />
  )
}
