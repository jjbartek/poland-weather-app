import { Prompt } from "../Contexts/PromptContext"
import React from "react"

interface Props {
  prompt: Prompt
}

const PromptItem: React.FC<Props> = ({ prompt }) => {
  return (
    <div>
      Komunikat o tytule {prompt.title} z treścią {prompt.title} ma typ {prompt.type}
    </div>
  )
}

export default PromptItem
