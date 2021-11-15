import React, { useCallback, useContext, useEffect, useState } from "react"

export interface Prompt {
  id: number
  promptType: 0 | 1 | 2
  title: string
  message: string
  handled: boolean
}

// Type 0 for errors
// Type 1 for success
// Type 2 for warnings

interface PromptContextState {
  prompts: Prompt[]
  addPrompt: (type: 0 | 1 | 2, title: string, message: string) => void
  removePrompt: (id: number) => void
}

type PromptContextType = null | PromptContextState

export const PromptContext = React.createContext<PromptContextType>(null)

export const PromptProvider: React.FC = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([])

  useEffect(() => {
    if (prompts.filter((prompt) => prompt.handled === false).length > 0) {
      setPrompts((previousPrompts) =>
        previousPrompts.map((prompt) => {
          if (prompt.handled === false) {
            setTimeout(() => {
              removePrompt(prompt.id)
            }, 5000)

            prompt.handled = true
          }

          return prompt
        })
      )
    }
  }, [prompts])

  const getNewPromptId = (previousPrompts: Prompt[]): number => {
    if (previousPrompts.length === 0) {
      return 0
    } else {
      return previousPrompts[previousPrompts.length - 1].id + 1
    }
  }

  const addPrompt = useCallback((promptType: 0 | 1 | 2, title: string, message: string) => {
    setPrompts((previousPrompts) => [
      ...previousPrompts,
      {
        handled: false,
        id: getNewPromptId(previousPrompts),
        message,
        promptType,
        title,
      } as Prompt,
    ])
  }, [])

  const removePrompt = (id: number) => {
    setPrompts((previousPrompts) => previousPrompts.filter((prompt) => prompt.id !== id))
  }

  return <PromptContext.Provider value={{ prompts, addPrompt, removePrompt }}>{children}</PromptContext.Provider>
}

export const PromptUseContext = (context: React.Context<PromptContextType>): PromptContextState => {
  const c = useContext(context)

  if (!c) {
    throw new Error(`Error: Can't use prompt context when it's empty.`)
  }

  return c
}

export default PromptContext
