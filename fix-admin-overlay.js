// Quick fix for Admin Panel overlay issue
const fs = require('fs');
const path = require('path');

const adminPanelPath = path.join(__dirname, 'src/pages/AdminPanel.jsx');
let content = fs.readFileSync(adminPanelPath, 'utf8');

// Tìm và sửa các class background
content = content.replace(
  /className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark via-dark-lighter to-dark"/g,
  'className="min-h-screen flex items-center justify-center px-4 admin-modal-fix"'
);

content = content.replace(
  /className="glass-dark rounded-3xl p-8 max-w-md w-full blur-shadow border border-lavender-200\/20"/g,
  'className="admin-overlay-fix rounded-3xl p-8 max-w-md w-full blur-shadow border border-lavender-200/20"'
);

content = content.replace(
  /className="glass-dark rounded-2xl p-6 mb-6 space-y-6 border border-lavender-200\/20"/g,
  'className="admin-form-fix rounded-2xl p-6 mb-6 space-y-6 border border-lavender-200/20"'
);

content = content.replace(
  /className="glass-dark rounded-2xl p-6 border border-lavender-200\/20"/g,
  'className="admin-content-fix rounded-2xl p-6 border border-lavender-200/20"'
);

content = content.replace(
  /className="min-h-screen pt-24 px-4 pb-20 bg-gradient-to-br from-dark via-dark-lighter to-dark"/g,
  'className="min-h-screen pt-24 px-4 pb-20 admin-modal-fix"'
);

content = content.replace(
  /className="glass-dark rounded-2xl p-6 blur-shadow border border-lavender-200\/20"/g,
  'className="admin-content-fix rounded-2xl p-6 blur-shadow border border-lavender-200/20"'
);

// Sửa input fields
content = content.replace(
  /className="w-full px-4 py-3 rounded-lg glass border-2 border-lavender-200\/30 focus:border-lavender-200 bg-dark-lighter\/50 text-lavender-50 font-nunito outline-none placeholder:text-lavender-200\/40"/g,
  'className="w-full px-4 py-3 rounded-lg admin-input-fix border-2 border-lavender-200/30 focus:border-lavender-200 text-lavender-50 font-nunito outline-none placeholder:text-lavender-200/40"'
);

// Sửa upload zone
content = content.replace(
  /className=\`\n\s*flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl \n\s*border-2 border-dashed cursor-pointer transition-all duration-300\n\s*\${uploading \n\s*.*?\}\n\s*\`/gs,
  'className={`flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 admin-upload-fix ${uploading ? "opacity-70" : ""}`}'
);

// Sửa buttons
content = content.replace(
  /className="flex-1 bg-gradient-to-r from-lavender-200 to-pink-200 text-dark font-nunito font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-lavender-200\/20"/g,
  'className="flex-1 admin-button-fix font-nunito font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg"'
);

content = content.replace(
  /className="px-8 glass text-pink-200 border-2 border-pink-200\/30 font-nunito font-bold py-3 rounded-full flex items-center gap-2 hover:bg-pink-200\/10 transition-colors"/g,
  'className="px-8 admin-cancel-fix text-pink-200 font-nunito font-bold py-3 rounded-full flex items-center gap-2 transition-colors"'
);

// Sửa tab active
content = content.replace(
  /className=\`px-6 py-3 rounded-full font-nunito font-bold whitespace-nowrap transition-all duration-300 border-2 \n\s*\${activeTab === tab\.id\n\s*.*?\}\n\s*\`/gs,
  'className={`px-6 py-3 rounded-full font-nunito font-bold whitespace-nowrap transition-all duration-300 border-2 admin-tab-fix ${activeTab === tab.id ? "admin-tab-active-fix text-lavender-50" : "border-lavender-200/20 hover:border-lavender-200/40 text-lavender-100"}`}'
);

// Sửa preview images
content = content.replace(
  /className="w-20 h-20 rounded-lg overflow-hidden border-2 border-lavender-200\/30"/g,
  'className="w-20 h-20 rounded-lg overflow-hidden admin-preview-fix"'
);

// Sửa progress bar
content = content.replace(
  /className="h-full bg-gradient-to-r from-lavender-200 to-pink-200"/g,
  'className="h-full admin-progress-fix"'
);

fs.writeFileSync(adminPanelPath, content);
console.log('✅ Đã sửa lỗi overlay Admin Panel!');
