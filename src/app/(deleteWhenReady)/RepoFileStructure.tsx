// Part of the (deleteWhenReady) route group — delete the whole folder.

import { FileTree } from "@/app/(deleteWhenReady)/FileTree";
import styles from "@/app/(deleteWhenReady)/page.module.css";

export function RepoFileStructure() {
  return (
    <section className={styles.repoStructure}>
      <h2 className={styles.pageHeading}>Repo file structure</h2>
      <p className={styles.includedCaption}>
        To make the set up easy, I put everything that is deletable in the
        &quot;delete when ready&quot; directory. The auth template doesn&apos;t
        need anything in there and is only used to render this site :) Click a
        file or folder with a 💡 to learn more about it.
      </p>
      <FileTree />
    </section>
  );
}
