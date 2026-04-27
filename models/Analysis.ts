import { initDB, createModel } from 'lyzr-architect';

let _model: any = null;

export default async function getAnalysisModel() {
  if (!_model) {
    await initDB();
    _model = createModel('Analysis', {
      title: { type: String, required: true },
      idea_text: { type: String, required: true },
      analysis_data: { type: Object, required: true },
      file_url: { type: String },
    });
  }
  return _model;
}
