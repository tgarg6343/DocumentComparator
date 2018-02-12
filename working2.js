var textract = require('textract');
var natural = require('natural');
var WordPOS = require('wordpos');
wordpos = new WordPOS();
const fs=require('fs');

var reportStatement='';

var wordcountbase=0;
var nouncountbase=0;
var nounsbase;
var tokensbase;
var allTextbase='';

var wordcounttest=0;
var nouncounttest=0;
var nounstest;
var tokenstest;
var allTexttest='';
var efficiency=100.0;

var testing={};
testing['base_document']={};
testing['test_document']={};
var baseNounPercentage;
var testNounPercentage;
var tokenizingbase=function(file){
 return new Promise(function(resolve,reject){
 	textract.fromFileWithPath(file, function( error, text ) {
	var tokenizer = new natural.WordTokenizer();
	tokensbase=tokenizer.tokenize(text);
	allTextbase=text;
	wordcountbase=tokensbase.length;
		
    wordpos.getNouns(text,function(result){
    	nouncountbase=result.length;
    	resolve('success');
});
});

    
 });
}


var tokenizingtest=function(file){
 return new Promise(function(resolve,reject){
 	textract.fromFileWithPath('Anish_bootstrap.docx', function( error, text ) {
	var tokenizer = new natural.WordTokenizer();
	tokenstest=tokenizer.tokenize(text);
	allTexttest=text;
	wordcounttest=tokenstest.length;
		
    wordpos.getNouns(text,function(result){
    	nouncounttest=result.length;
    	resolve('success');
});
});

    
 });
}

Promise.all([tokenizingbase('bootstrap_documantation.docx'),tokenizingtest('bootstrap_documantation.docx')]).then(function(){
	testing.base_document['word_count']=wordcountbase;
	testing.base_document['noun_count']=nouncountbase;
	testing.test_document['word_count']=wordcounttest;
	testing.test_document['noun_count']=nouncounttest;
	// console.log("word count base is"+wordcountbase);
	// console.log("noun count base is"+nouncountbase);
	// console.log("word count test is"+wordcounttest);
	// console.log("noun count test is"+nouncounttest);

 	if(wordcounttest>=(85*wordcountbase/100)&&wordcounttest<=(115*wordcountbase/100)){
 		if(wordcountbase>wordcounttest){
 			efficiency-=wordcounttest*100/wordcountbase;
 		}
 		else
 		{
 			efficiency+=wordcounttest*100/wordcountbase;
 		}

 		baseNounPercentage=nouncountbase/wordcountbase*100;
 		testing.base_document['noun_percentage']=baseNounPercentage;
		testNounPercentage=nouncounttest/wordcounttest*100;
		testing.test_document['noun_percentage']=testNounPercentage;
 		if(Math.abs(baseNounPercentage-testNounPercentage)<=15){

 				if(nouncountbase>nouncounttest){
 			efficiency-=nouncounttest*100/nouncountbase;
 		}
 		else{
 			efficiency+=nouncounttest*100/nouncountbase;

 		}
 			let similarity=natural.JaroWinklerDistance(allTextbase,allTexttest)*100;
 			reportStatement+="Similarity in document is "+similarity+" %"+"<br>";

 			if(similarity>50){
 				efficiency-=similarity/10;
 			}



 			//console.log(testing);
 			reportStatement+="Efficiency with respect to base documment is "+efficiency+" %";

 			testing['Remarks']={'DocumentReport':reportStatement};

 		}
 		else{
 			reportStatement+="noun percentage is very less";
 		}
 	}
 	else{
 		reportStatement+="word count is not in range";
 	}
 	
 	let json=JSON.stringify(testing,null,2);
 	fs.writeFile('data.json',json,'utf-8',(err)=> {
 		if(err){
 			console.log("error");
 			return;
 		}
 		console.log("success");

 	})

});


	