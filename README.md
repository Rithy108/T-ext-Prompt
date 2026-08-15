# 尺丨ㄒ卄ㄚ×卂丨✦ — Prompt Architect (Vercel Deployment)

## រចនាសម្ព័ន្ធ Project
```
index.html          ← Frontend (UI ដែលអ្នកមានស្រាប់)
api/generate.js      ← Serverless Function ហៅទៅ Gemini API
vercel.json          ← កំណត់ timeout សម្រាប់ function
```

## ជំហានទី ១ — យក Gemini API Key
1. ចូល https://aistudio.google.com/apikey
2. ចុច **"Create API Key"**
3. Copy key ទុក (ចាប់ផ្ដើមដោយ `AIza...`)

## ជំហានទី ២ — Deploy ទៅ Vercel
### របៀបទី ១៖ តាមរយៈ GitHub (ណែនាំ)
1. Push folder នេះទៅ GitHub repository
2. ចូល https://vercel.com → **New Project** → ជ្រើសរើស repo នេះ
3. Framework Preset: ជ្រើស **"Other"** (ព្រោះជា static HTML + serverless function)
4. **កុំចុច Deploy ភ្លាមៗ** — សូមទៅជំហានទី ៣ ដើម្បីដាក់ API Key ជាមុនសិន

### របៀបទី ២៖ តាមរយៈ Vercel CLI
```bash
npm install -g vercel
cd project-folder
vercel
```

## ជំហានទី ៣ — ដាក់ Environment Variable (សំខាន់បំផុត!)
1. នៅក្នុង Vercel Dashboard → Project → **Settings → Environment Variables**
2. បន្ថែម variable ថ្មី៖
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (paste key ដែល copy ពីជំហានទី ១)
   - **Environment:** ជ្រើសទាំង Production, Preview, Development
3. ចុច **Save**
4. ទៅ **Deployments** tab → ចុច **"Redeploy"** (env var មិន apply ភ្លាមទេ បើមិន redeploy)

## ការសាកល្បង
បន្ទាប់ពី deploy រួច បើក URL ដែល Vercel ផ្ដល់ (ឧ. `your-project.vercel.app`)៖
1. ផ្ទុករូបភាពយោង
2. កំណត់ជម្រើសនានា (Camera, Lens, Scenery ។ល។)
3. ចុច "ទាញយក និងបង្កើត Prompt"
4. បើមានបញ្ហា ត្រូវពិនិត្យមើល **Vercel → Deployments → Functions → Logs** ដើម្បីមើល error message ពិតប្រាកដ

## ចំណាំសុវត្ថិភាព
- កុំដាក់ API key ក្នុង `index.html` ឬ code ណាមួយដែល push ទៅ GitHub ជាដាច់ខាត
- Key ស្ថិតតែក្នុង `api/generate.js` តាមរយៈ `process.env.GEMINI_API_KEY` ប៉ុណ្ណោះ ដែលដំណើរការនៅ server-side (មិនអាចមើលឃើញពី browser)
- កំណត់ Rate Limit ឬ Quota នៅក្នុង Google AI Studio ដើម្បីការពារការប្រើប្រាស់ហួសកំណត់

## ប្តូរទៅ Model ថ្មីជាង (ស្រេចចិត្ត)
Model លំនាំដើមគឺ `gemini-2.5-flash`។ បើចង់ប្តូរ បន្ថែម Environment Variable មួយទៀត៖
- **Name:** `GEMINI_MODEL`
- **Value:** ឈ្មោះ model ថ្មី (ឧ. `gemini-3-flash`) — គួរពិនិត្យមើល https://ai.google.dev/gemini-api/docs/models មុននឹងប្តូរ ព្រោះឈ្មោះ model ផ្លាស់ប្តូរញឹកញាប់
