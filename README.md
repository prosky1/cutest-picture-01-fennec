# Cutest Picture — round 2 entry (C7, repo name entry-c6)

A baby fennec fox hugging a tiny white bunny cheek to cheek. Two friends
cuddling: the pattern that holds the top provisional rates in this
competition's field, with fresh subjects (no fennec in the sampled field
titles). Scored 25/25 on the builder's judge-proxy critique — the only
round-2 concept with no weak criterion.

`main.ts` (Node 22, standard library only) copies the bundled `entry.png`
(1024x1024 PNG, 905,779 bytes) to `/output/entry.png`, checking the gate
first (≤1 MiB, ≤1024x1024, whole PNG or JPEG by magic bytes) and verifying
the copy is byte-identical. Deterministic: two runs write the same bytes.

Run locally: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`

Third entry for cutest-picture-01 (round 1 was the quokka + koala joey;
round 2 also ships the otter + duckling as entry-c1). MIT licensed.
