"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _express = _interopRequireDefault(require("express"));
var _child_process = require("child_process");
var _logger = _interopRequireDefault(require("./logger"));
var _config = _interopRequireDefault(require("./config"));
var _path = _interopRequireDefault(require("path"));
const _excluded = ["model", "prompt", "stream"],
  _excluded2 = ["model", "prompt", "stream"];
const ollamaService = require('./utils/llm');
const anagineRouter = _express.default.Router();
anagineRouter.get('/hello', (req, res) => {
  res.send({
    text: "Hello World",
    time: new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'UTC'
    }),
    subject: [{
      "patient": "Patient A",
      "age": 30,
      "hospital": {
        "name": "General Hospital",
        "location": "Indiana"
      }
    }, {
      "patient": "Patient B",
      "age": 65,
      "hospital": {
        "name": "Another Hospital",
        "location": "New York"
      }
    }]
  });
  return 0;
});
anagineRouter.get('/pdf', (req, res) => {
  // log.info(filepath);
  const filepath = "/home/exouser/Downloads/gen3.pdf";
  // res.contentType('application/pdf');
  res.download(filepath);
  return 0;
});
anagineRouter.get('/R/lm', (req, res) => {
  const data = {
    x: [1, 2, 3],
    y: [3, 5, 7]
  };
  const inputJSON = (0, _stringify.default)(data);
  const rScriptPath = _path.default.join(__dirname, '../R/lm.R');
  _logger.default.info('rScriptPath:', rScriptPath);
  const rProcess = (0, _child_process.spawn)('Rscript', [rScriptPath, inputJSON]);
  let output = '';
  let errorOutput = '';

  // Collect data from stdout
  rProcess.stdout.on('data', dataChunk => {
    output += dataChunk.toString();
  });
  _logger.default.info('output:', output);

  // Collect errors from stderr
  rProcess.stderr.on('data', dataChunk => {
    errorOutput += dataChunk.toString();
  });

  // When the R script finishes
  rProcess.on('close', code => {
    if (code !== 0) {
      console.error('R script error:', errorOutput);
      return res.status(500).send(`Error running R script: ${errorOutput}`);
    }
    try {
      // Parse the JSON output from the R script
      const result = JSON.parse(output);
      result["time"] = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'UTC'
      });
      res.json(result);
    } catch (err) {
      console.error('Error parsing R script output:', err);
      res.status(500).send('Error parsing R script output.');
    }
  });
});
anagineRouter.get('/llm/chat', async (req, res) => {
  const _req$query = req.query,
    {
      model = _config.default.ollamaConfig.model,
      prompt,
      stream = false
    } = _req$query,
    options = (0, _objectWithoutPropertiesLoose2.default)(_req$query, _excluded);
  const messages = [{
    role: 'user',
    content: prompt || 'Hi, could you introduce yourself?'
  }];
  const llm_response = await ollamaService.chatWithModel(model, messages, stream, options);
  res.send({
    response: llm_response
  });
  return 0;
});
anagineRouter.get('/llm/generate', async (req, res) => {
  const _req$query2 = req.query,
    {
      model = _config.default.ollamaConfig.model,
      prompt,
      stream = false
    } = _req$query2,
    options = (0, _objectWithoutPropertiesLoose2.default)(_req$query2, _excluded2);
  const messages = [{
    role: 'user',
    content: prompt || 'Hi, could you introduce yourself?'
  }];
  const llm_response = await ollamaService.generateText(model, messages, stream, options);
  res.send({
    response: llm_response
  });
  return 0;
});
var _default = exports.default = anagineRouter;