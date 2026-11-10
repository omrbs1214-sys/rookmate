ROOKMATE APK - bina kuch install kiye (GitHub se cloud me build)

1) www/ folder me ye 2 images daalo (exact naam):
     rookmate-rook.png   (logo)
     rookmate-arena.png  (background)
2) github.com par free account -> New repository (naam: rookmate)
3) "uploading an existing file" se is poore folder ki saari files upload karo
   (.github folder samet! Hidden folder hai, drag-drop se upload karna).
4) Repo me Actions tab -> "Build APK" -> Run workflow (ya upload par khud chalega).
5) 5-8 min baad run khulega -> neeche Artifacts me "rookmate-apk" download karo,
   zip kholo -> app-debug.apk phone me install karo
   (Settings me "Install unknown apps" allow karna padega).

Note: Libraries (three.js, tailwind, peerjs) internet se aati hain, isliye app ko net chahiye.
