import React, { Component } from "react";
import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import "survey-creator/survey-creator.css";

//ADDED THESE 2 
import * as CKEDITOR from 'ckeditor';
import * as showdown from "showdown";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

//import "icheck/skins/square/blue.css";
import "pretty-checkbox/dist/pretty-checkbox.css";

import * as widgets from "surveyjs-widgets";

SurveyJSCreator.StylesManager.applyTheme("default");

//widgets.icheck(SurveyKo, $);
widgets.prettycheckbox(SurveyKo);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
//widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);


///ADDED THIS CODE BLOCK FROM SAMPLE

var CkEditor_ModalEditor = {
  afterRender:  (modalEditor, htmlElement) => {   
      var editor = CKEDITOR.replace(htmlElement);
      var isUpdating = false;
      editor.on("change", function () {
          isUpdating = true;
          modalEditor.editingValue = editor.getData();
          isUpdating = false;
      }
      );
      editor.setData(modalEditor.editingValue);
      modalEditor.onValueUpdated = function (newValue) {
          if (!isUpdating) {
              editor.setData(newValue);
          }
      };
  },
  destroy: (modalEditor, htmlElement) => {
      var instance = CKEDITOR.instances[htmlElement.id];
      if (instance) {
          instance.removeAllListeners();
          CKEDITOR.remove(instance);
      }
  }
};

  SurveyJSCreator
  .SurveyPropertyModalEditor
  .registerCustomWidget("html", CkEditor_ModalEditor);
  
  SurveyJSCreator
  .SurveyPropertyModalEditor
  .registerCustomWidget("text", CkEditor_ModalEditor);
  
  
  
  //Create showdown mardown converter
  var converter = new showdown.Converter();
  function doMarkdown(survey, options) {
  //convert the mardown text to html
  var str = converter.makeHtml(options.text);
  if (str.indexOf("<p>") == 0) {
      //remove root paragraphs<p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
  }
  //set html
  options.html = str;
  }

///



class SurveyCreator extends Component {
  surveyCreator;
  componentDidMount() {
    let options = { showEmbededSurveyTab: true };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(
      null,
      options
    );


/// ADDED THIS Could block from sample
    this.surveyCreator
    .survey
    .onTextMarkdown
    .add(doMarkdown);
    this.surveyCreator
    .onDesignerSurveyCreated
    .add(function (editor, options) {
        options
            .survey
            .onTextMarkdown
            .add(doMarkdown);
    });
    this.surveyCreator
    .onTestSurveyCreated
    .add(function (editor, options) {
        options
            .survey
            .onTextMarkdown
            .add(doMarkdown);
    });

///

    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.tabs().push({
      name: "survey-templates",
      title: "My Custom Tab",
      template: "custom-tab-survey-templates",
      action: () => {
          this.surveyCreator.makeNewViewActive("survey-templates");
      },
      data: {},
    });
    this.surveyCreator.render("surveyCreatorContainer");
  }
  render() {
    return (<div>
      <script type="text/html" id="custom-tab-survey-templates">
        {`<div id="test">TEST</div>`}
      </script>

      <div id="surveyCreatorContainer" />
    </div>);
  }
  saveMySurvey = () => {
    console.log(JSON.stringify(this.surveyCreator.text));
  };
}

export default SurveyCreator;
