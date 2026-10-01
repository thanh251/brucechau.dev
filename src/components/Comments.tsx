import Giscus from '@giscus/react'

type Props = {
  repo: `${string}/${string}`
  repoId: string
  category: string
  categoryId: string
}

export default function Comments({ repo, repoId, category, categoryId }: Props) {
  return (
    <div className="comments">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
