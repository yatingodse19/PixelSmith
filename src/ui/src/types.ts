export interface Pipeline {
  name?: string;
  pipeline: PipelineOperation[];
  output?: {
    dir?: string;
    pattern?: string;
  };
}

export interface PipelineOperation {
  op: 'resize' | 'crop' | 'convert' | 'metadata';
  [key: string]: unknown;
}

export interface ProcessingResult {
  inputPath: string;
  outputPath?: string;
  outputUrl?: string;
  success: boolean;
  error?: string;
  inputSize?: number;
  outputSize?: number;
  width?: number;
  height?: number;
  format?: string;
  duration?: number;
}

export interface Preset {
  name: string;
  pipeline: Pipeline;
}
