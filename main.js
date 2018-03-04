/*var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
console.log(tokenizer.tokenize("your dog has fleas."));
// [ 'your', 'dog', 'has', 'fleas' ]

var natural = require('natural');
console.log(natural.JaroWinklerDistance("dixon","dicksonx"))
console.log(natural.JaroWinklerDistance('not', 'same'));

var natural = require("natural");
var path = require("path");
 
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.basePos";
var defaultCategory = 'N';
 
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
 
var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
console.log(basePos.stringify(tagger.tag(sentence)));
// [["I","NN"],["see","VB"],["the","DT"],["man","NN"],["with","IN"],["the","DT"],["telescope","NN"]]
 */


var baseFileName="bootstrap1.txt";
var baseFile;
var baseWordCount=0;
var baseNounCount=0;
var baseAdjCount=0;
var baseVerbCount=0;
var baseNounPerc=0;
var baseAdjPerc=0;
var baseVerbPerc=0;

var testFileName="bootstrap2.txt";
var testFile;
var testWordCount=0;
var testNounCount=0;
var testAdjCount=0;
var testVerbCount=0;
var testNounPerc=0;
var testAdjPerc=0;
var testVerbPerc=0;

var testing={};
testing['base_document']={};
testing['test_document']={};


var natural=require('natural');
var path = require("path");
var fs=require('fs');
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
 
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
var tokenizer = new natural.WordTokenizer();

var baseFile = fs.readFileSync(baseFileName,'utf-8');
var baseTokens=tokenizer.tokenize(baseFile); 
baseWordCount=baseTokens.length;
console.log(baseWordCount);
var basePos=tagger.tag(baseTokens);
//console.log(basePos.stringify(tagger.tag(tokens)));

var testFile=fs.readFileSync(testFileName,'utf-8');
var testTokens=tokenizer.tokenize(testFile);
testWordCount=testTokens.length;
console.log(testWordCount);
var testPos=tagger.tag(testTokens);

for(var i in basePos){
    if(basePos[i][1]=='NN'||basePos[i][1]=='NNP'||basePos[i][1]=='NNPS'||basePos[i][1]=='NNS')
      baseNounCount++;
    if(basePos[i][1]=='VB'||basePos[i][1]=='VBD'||basePos[i][1]=='VBG'||basePos[i][1]=='VBP'||basePos[i][1]=='VBN'||basePos[i][1]=='VBZ')
      baseVerbCount++;  
    if(basePos[i][1]=='JJ'||basePos[i][1]=='JJR'||basePos[i][1]=='JJS')
      baseAdjCount++;   
  }
baseNounPerc=baseNounCount/baseWordCount*100;
baseVerbPerc=baseVerbCount/baseWordCount*100;
baseAdjPerc=baseAdjCount/baseWordCount*100;
for(var i in testPos){
    if(testPos[i][1]=='NN'||testPos[i][1]=='NNP'||testPos[i][1]=='NNPS'||testPos[i][1]=='NNS')
      testNounCount++;
    if(testPos[i][1]=='VB'||testPos[i][1]=='VBD'||testPos[i][1]=='VBG'||testPos[i][1]=='VBP'||testPos[i][1]=='VBN'||testPos[i][1]=='VBZ')
      testVerbCount++;  
    if(testPos[i][1]=='JJ'||testPos[i][1]=='JJR'||testPos[i][1]=='JJS')
      testAdjCount++;   
  }
testNounPerc=testNounCount/testWordCount*100;
testVerbPerc=testVerbCount/testWordCount*100;
testAdjPerc=testAdjCount/testWordCount*100;

testing.base_document['word_count']=baseWordCount;
	testing.base_document['noun_count']=baseNounCount;
	testing.test_document['word_count']=testWordCount;
	testing.test_document['noun_count']=testNounCount;
var report="";
 	if(testWordCount>=(75*baseWordCount/100)&&testWordCount<=(125*baseWordCount/100)){
 		testing.base_document['noun_percentage']=baseNounPerc;
		testing.test_document['noun_percentage']=testNounPerc;
 		if(Math.abs(baseNounPerc-testNounPerc)<=5){

 			let similarity=natural.JaroWinklerDistance(baseFile,testFile)*100;
 			report+="Similarity in document is "+similarity+" %";
 			testing['Remarks']=report;
 		}
 		else{
 			report+="noun percentage is very less";
 		}
 	}
 	else{
 		report+="word count is not in range";
 	}
testing['Remarks']=report;
 console.log("");
/* console.log(baseNounCount);
 console.log(baseVerbCount);
 console.log(baseAdjCount);
 console.log(testNounCount);
 console.log(testVerbCount);
 console.log(testAdjCount);
 console.log(baseNounPerc);
 console.log(baseVerbPerc);
 console.log(baseAdjPerc);
 console.log(testNounPerc);
 console.log(testVerbPerc);
 console.log(testAdjPerc);*/

let json=JSON.stringify(testing,null,2);
   //writing final data into json
   fs.writeFile('data.json',json,'utf8',(err)=>{
    if(err){
      console.log("Error");
      return;
    }
   });