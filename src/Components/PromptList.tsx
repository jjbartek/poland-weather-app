import React, { useContext } from "react"

import { Icon } from "."
import { PromptContext } from "../Contexts/PromptContext"
import { PromptStyles } from "../Styles/Components"
import classNames from "classnames"

const PromptList: React.FC = () => {
  const { prompts, removePrompt } = useContext(PromptContext)!

  return (
    <div className={PromptStyles.promptsList}>
      {prompts.map((prompt, i) => (
        <div className={PromptStyles.promptsItem} key={i}>
          {prompt.promptType === 0 && <Icon className={classNames(PromptStyles.promptsIcon, PromptStyles.promptsIconError)} name={"error"} />}
          {prompt.promptType === 1 && <Icon className={classNames(PromptStyles.promptsIcon, PromptStyles.promptsIconSuccess)} name={"success"} />}

          <div className={PromptStyles.promptsContent}>
            <span className={PromptStyles.promptsTitle}>{prompt.title}</span>
            {prompt.message}
          </div>

          <button onClick={() => removePrompt(prompt.id)} className={PromptStyles.promptsClose}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default PromptList
