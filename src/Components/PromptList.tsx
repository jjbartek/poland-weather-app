import { PromptContext, PromptUseContext } from "../Contexts/PromptContext"

import { Icon } from "."
import { PromptStyles } from "../Styles/Components"
import React from "react"
import classNames from "classnames"

const PromptList: React.FC = () => {
  const { prompts, removePrompt } = PromptUseContext(PromptContext)

  return (
    <div className={PromptStyles.prompts__list}>
      {prompts.map((prompt, i) => (
        <div className={PromptStyles.prompts__item} key={i}>
          {prompt.promptType === 0 && <Icon className={classNames(PromptStyles.prompts__icon, PromptStyles.prompts__iconError)} name={"error"} />}
          {prompt.promptType === 1 && <Icon className={classNames(PromptStyles.prompts__icon, PromptStyles.prompts__iconSuccess)} name={"success"} />}

          <div className={PromptStyles.prompts__content}>
            <span className={PromptStyles.prompts__title}>{prompt.title}</span>
            {prompt.message}
          </div>

          <button onClick={() => removePrompt(prompt.id)} className={PromptStyles.prompts__close}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default PromptList
