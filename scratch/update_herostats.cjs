const fs = require('fs');
const path = 'src/components/dashboard/HeroStats.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add useRef and setUser
content = content.replace(/const \{ user \} = useApp\(\);/, 'const { user, setUser } = useApp();\n  const fileInputRef = React.useRef<HTMLInputElement>(null);');

// Add file input handler
const handleFile = `
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Basic client-side resize to prevent huge localStorage sizes
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setUser(prev => ({ ...prev, avatarUrl: compressedBase64 }));
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };
`;

content = content.replace(/return \(/, handleFile + '\n  return (');

// Update Avatar JSX
const oldAvatar = /<div className="relative flex-shrink-0">[\s\S]*?<\/div>/;
const newAvatar = `<div className="relative flex-shrink-0 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-comic-black object-cover bg-white"
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleProfileImageChange} 
              className="hidden" 
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 bg-comic-red text-white text-[9px] font-comic font-black rounded-full border border-comic-black">
              L{user.level}
            </span>
          </div>`;

content = content.replace(oldAvatar, newAvatar);

fs.writeFileSync(path, content, 'utf8');
