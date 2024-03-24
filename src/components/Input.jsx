import React, { useState, useContext, useEffect } from 'react';
import { AiOutlineFile } from 'react-icons/ai';
import { ChatContext } from '../Context/ChatContext';
import { AuthContext } from '../Context/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import EmojiPicker from 'emoji-picker-react'; // Import the emoji picker library

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [gif, setGif] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  // const badWords = require('./bad-words-in-array.txt').split('\n');
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

// DISCLAIMER List of vulgar words to be censored
  const vulgarWords = ["abbo","abo","abortion","abuse","addict","addicts","adult","africa","african","alla","allah","alligatorbait","amateur","american","anal","analannie","analsex","angie","angry","anus","arab","arabs","areola","argie","aroused","arse","arsehole","asian","ass","assassin","assassinate","assassination","assault","assbagger","assblaster","assclown","asscowboy","asses","assfuck","assfucker","asshat","asshole","assholes","asshore","assjockey","asskiss","asskisser","assklown","asslick","asslicker","asslover","assman","assmonkey","assmunch","assmuncher","asspacker","asspirate","asspuppies","assranger","asswhore","asswipe","athletesfoot","attack","australian","babe","babies","backdoor","backdoorman","backseat","badfuck","balllicker","balls","ballsack","banging","baptist","barelylegal","barf","barface","barfface","bast","bastard ","bazongas","bazooms","beaner","beast","beastality","beastial","beastiality","beatoff","beat-off","beatyourmeat","beaver","bestial","bestiality","bi","biatch","bible","bicurious","bigass","bigbastard","bigbutt","bigger","bisexual","bi-sexual","bitch","bitcher","bitches","bitchez","bitchin","bitching","bitchslap","bitchy","biteme","black","blackman","blackout","blacks","blind","blow","blowjob","boang","bogan","bohunk","bollick","bollock","bomb","bombers","bombing","bombs","bomd","bondage","boner","bong","boob","boobies","boobs","booby","boody","boom","boong","boonga","boonie","booty","bootycall","bountybar","bra","brea5t","breast","breastjob","breastlover","breastman","brothel","bugger","buggered","buggery","bullcrap","bulldike","bulldyke","bullshit","bumblefuck","bumfuck","bunga","bunghole","buried","burn","butchbabes","butchdike","butchdyke","butt","buttbang","butt-bang","buttface","buttfuck","butt-fuck","buttfucker","butt-fucker","buttfuckers","butt-fuckers","butthead","buttman","buttmunch","buttmuncher","buttpirate","buttplug","buttstain","byatch","cacker","cameljockey","cameltoe","canadian","cancer","carpetmuncher","carruth","catholic","catholics","cemetery","chav","cherrypopper","chickslick","children's","chin","chinaman","chinamen","chinese","chink","chinky","choad","chode","christ","christian","church","cigarette","cigs","clamdigger","clamdiver","clit","clitoris","clogwog","cocaine","cock","cockblock","cockblocker","cockcowboy","cockfight","cockhead","cockknob","cocklicker","cocklover","cocknob","cockqueen","cockrider","cocksman","cocksmith","cocksmoker","cocksucer","cocksuck ","cocksucked ","cocksucker","cocksucking","cocktail","cocktease","cocky","cohee","coitus","color","colored","coloured","commie","communist","condom","conservative","conspiracy","coolie","cooly","coon","coondog","copulate","cornhole","corruption","cra5h","crabs","crack","crackpipe","crackwhore","crack-whore","crap","crapola","crapper","crappy","crash","creamy","crime","crimes","criminal","criminals","crotch","crotchjockey","crotchmonkey","crotchrot","cum","cumbubble","cumfest","cumjockey","cumm","cummer","cumming","cumquat","cumqueen","cumshot","cunilingus","cunillingus","cunn","cunnilingus","cunntt","cunt","cunteyed","cuntfuck","cuntfucker","cuntlick ","cuntlicker ","cuntlicking ","cuntsucker","cybersex","cyberslimer","dago","dahmer","dammit","damn","damnation","damnit","darkie","darky","datnigga","dead","deapthroat","death","deepthroat","defecate","dego","demon","deposit","desire","destroy","deth","devil","devilworshipper","dick","dickbrain","dickforbrains","dickhead","dickless","dicklick","dicklicker","dickman","dickwad","dickweed","diddle","die","died","dies","dike","dildo","dingleberry","dink","dipshit","dipstick","dirty","disease","diseases","disturbed","dive","dix","dixiedike","dixiedyke","doggiestyle","doggystyle","dong","doodoo","doo-doo","doom","dope","dragqueen","dragqween","dripdick","drug","drunk","drunken","dumb","dumbass","dumbbitch","dumbfuck","dyefly","dyke","easyslut","eatballs","eatme","eatpussy","ecstacy","ejaculate","ejaculated","ejaculating ","ejaculation","enema","enemy","erect","erection","ero","escort","ethiopian","ethnic","european","evl","excrement","execute","executed","execution","executioner","explosion","facefucker","faeces","fag","fagging","faggot","fagot","failed","failure","fairies","fairy","faith","fannyfucker","fart","farted ","farting ","farty ","fastfuck","fat","fatah","fatass","fatfuck","fatfucker","fatso","fckcum","fear","feces","felatio ","felch","felcher","felching","fellatio","feltch","feltcher","feltching","fetish","fight","filipina","filipino","fingerfood","fingerfuck ","fingerfucked ","fingerfucker ","fingerfuckers","fingerfucking ","fire","firing","fister","fistfuck","fistfucked ","fistfucker ","fistfucking ","fisting","flange","flasher","flatulence","floo","flydie","flydye","fok","fondle","footaction","footfuck","footfucker","footlicker","footstar","fore","foreskin","forni","fornicate","foursome","fourtwenty","fraud","freakfuck","freakyfucker","freefuck","fu","fubar","fuc","fucck","fuck","fucka","fuckable","fuckbag","fuckbuddy","fucked","fuckedup","fucker","fuckers","fuckface","fuckfest","fuckfreak","fuckfriend","fuckhead","fuckher","fuckin","fuckina","fucking","fuckingbitch","fuckinnuts","fuckinright","fuckit","fuckknob","fuckme ","fuckmehard","fuckmonkey","fuckoff","fuckpig","fucks","fucktard","fuckwhore","fuckyou","fudgepacker","fugly","fuk","fuks","funeral","funfuck","fungus","fuuck","gangbang","gangbanged ","gangbanger","gangsta","gatorbait","gay","gaymuthafuckinwhore","gaysex ","geez","geezer","geni","genital","german","getiton","gin","ginzo","gipp","girls","givehead","glazeddonut","gob","god","godammit","goddamit","goddammit","goddamn","goddamned","goddamnes","goddamnit","goddamnmuthafucker","goldenshower","gonorrehea","gonzagas","gook","gotohell","goy","goyim","greaseball","gringo","groe","gross","grostulation","gubba","gummer","gun","gyp","gypo","gypp","gyppie","gyppo","gyppy","hamas","handjob","hapa","harder","hardon","harem","headfuck","headlights","hebe","heeb","hell","henhouse","heroin","herpes","heterosexual","hijack","hijacker","hijacking","hillbillies","hindoo","hiscock","hitler","hitlerism","hitlerist","hiv","ho","hobo","hodgie","hoes","hole","holestuffer","homicide","homo","homobangers","homosexual","honger","honk","honkers","honkey","honky","hook","hooker","hookers","hooters","hore","hork","horn","horney","horniest","horny","horseshit","hosejob","hoser","hostage","hotdamn","hotpussy","hottotrot","hummer","husky","hussy","hustler","hymen","hymie","iblowu","idiot","ikey","illegal","incest","insest","intercourse","interracial","intheass","inthebuff","israel","israeli","israel's","italiano","itch","jackass","jackoff","jackshit","jacktheripper","jade","jap","japanese","japcrap","jebus","jeez","jerkoff","jesus","jesuschrist","jew","jewish","jiga","jigaboo","jigg","jigga","jiggabo","jigger ","jiggy","jihad","jijjiboo","jimfish","jism","jiz ","jizim","jizjuice","jizm ","jizz","jizzim","jizzum","joint","juggalo","jugs","junglebunny","kaffer","kaffir","kaffre","kafir","kanake","kid","kigger","kike","kill","killed","killer","killing","kills","kink","kinky","kissass","kkk","knife","knockers","kock","kondum","koon","kotex","krap","krappy","kraut","kum","kumbubble","kumbullbe","kummer","kumming","kumquat","kums","kunilingus","kunnilingus","kunt","ky","kyke","lactate","laid","lapdance","latin","lesbain","lesbayn","lesbian","lesbin","lesbo","lez","lezbe","lezbefriends","lezbo","lezz","lezzo","liberal","libido","licker","lickme","lies","limey","limpdick","limy","lingerie","liquor","livesex","loadedgun","lolita","looser","loser","lotion","lovebone","lovegoo","lovegun","lovejuice","lovemuscle","lovepistol","loverocket","lowlife","lsd","lubejob","lucifer","luckycammeltoe","lugan","lynch","macaca","mad","mafia","magicwand","mams","manhater","manpaste","marijuana","mastabate","mastabater","masterbate","masterblaster","mastrabator","masturbate","masturbating","mattressprincess","meatbeatter","meatrack","meth","mexican","mgger","mggor","mickeyfinn","mideast","milf","minority","mockey","mockie","mocky","mofo","moky","moles","molest","molestation","molester","molestor","moneyshot","mooncricket","mormon","moron","moslem","mosshead","mothafuck","mothafucka","mothafuckaz","mothafucked ","mothafucker","mothafuckin","mothafucking ","mothafuckings","motherfuck","motherfucked","motherfucker","motherfuckin","motherfucking","motherfuckings","motherlovebone","muff","muffdive","muffdiver","muffindiver","mufflikcer","mulatto","muncher","munt","murder","murderer","muslim","naked","narcotic","nasty","nastybitch","nastyho","nastyslut","nastywhore","nazi","necro","negro","negroes","negroid","negro's","nig","niger","nigerian","nigerians","nigg","nigga","niggah","niggaracci","niggard","niggarded","niggarding","niggardliness","niggardliness's","niggardly","niggards","niggard's","niggaz","nigger","niggerhead","niggerhole","niggers","nigger's","niggle","niggled","niggles","niggling","nigglings","niggor","niggur","niglet","nignog","nigr","nigra","nigre","nip","nipple","nipplering","nittit","nlgger","nlggor","nofuckingway","nook","nookey","nookie","noonan","nooner","nude","nudger","nuke","nutfucker","nymph","ontherag","oral","orga","orgasim ","orgasm","orgies","orgy","osama","paki","palesimian","palestinian","pansies","pansy","panti","panties","payo","pearlnecklace","peck","pecker","peckerwood","pee","peehole","pee-pee","peepshow","peepshpw","pendy","penetration","peni5","penile","penis","penises","penthouse","period","perv","phonesex","phuk","phuked","phuking","phukked","phukking","phungky","phuq","pi55","picaninny","piccaninny","pickaninny","piker","pikey","piky","pimp","pimped","pimper","pimpjuic","pimpjuice","pimpsimp","pindick","piss","pissed","pisser","pisses ","pisshead","pissin ","pissing","pissoff ","pistol","pixie","pixy","playboy","playgirl","pocha","pocho","pocketpool","pohm","polack","pom","pommie","pommy","poo","poon","poontang","poop","pooper","pooperscooper","pooping","poorwhitetrash","popimp","porchmonkey","porn","pornflick","pornking","porno","pornography","pornprincess","pot","poverty","premature","pric","prick","prickhead","primetime","propaganda","pros","prostitute","protestant","pu55i","pu55y","pube","pubic","pubiclice","pud","pudboy","pudd","puddboy","puke","puntang","purinapricness","puss","pussie","pussies","pussy","pussycat","pussyeater","pussyfucker","pussylicker","pussylips","pussylover","pussypounder","pusy","quashie","queef","queer","quickie","quim","ra8s","rabbi","racial","racist","radical","radicals","raghead","randy","rape","raped","raper","rapist","rearend","rearentry","rectum","redlight","redneck","reefer","reestie","refugee","reject","remains","rentafuck","republican","rere","retard","retarded","ribbed","rigger","rimjob","rimming","roach","robber","roundeye","rump","russki","russkie","sadis","sadom","samckdaddy","sandm","sandnigger","satan","scag","scallywag","scat","schlong","screw","screwyou","scrotum","scum","semen","seppo","servant","sex","sexed","sexfarm","sexhound","sexhouse","sexing","sexkitten","sexpot","sexslave","sextogo","sextoy","sextoys","sexual","sexually","sexwhore","sexy","sexymoma","sexy-slim","shag","shaggin","shagging","shat","shav","shawtypimp","sheeney","shhit","shinola","shit","shitcan","shitdick","shite","shiteater","shited","shitface","shitfaced","shitfit","shitforbrains","shitfuck","shitfucker","shitfull","shithapens","shithappens","shithead","shithouse","shiting","shitlist","shitola","shitoutofluck","shits","shitstain","shitted","shitter","shitting","shitty ","shoot","shooting","shortfuck","showtime","sick","sissy","sixsixsix","sixtynine","sixtyniner","skank","skankbitch","skankfuck","skankwhore","skanky","skankybitch","skankywhore","skinflute","skum","skumbag","slant","slanteye","slapper","slaughter","slav","slave","slavedriver","sleezebag","sleezeball","slideitin","slime","slimeball","slimebucket","slopehead","slopey","slopy","slut","sluts","slutt","slutting","slutty","slutwear","slutwhore","smack","smackthemonkey","smut","snatch","snatchpatch","snigger","sniggered","sniggering","sniggers","snigger's","sniper","snot","snowback","snownigger","sob","sodom","sodomise","sodomite","sodomize","sodomy","sonofabitch","sonofbitch","sooty","sos","soviet","spaghettibender","spaghettinigger","spank","spankthemonkey","sperm","spermacide","spermbag","spermhearder","spermherder","spic","spick","spig","spigotty","spik","spit","spitter","splittail","spooge","spreadeagle","spunk","spunky","squaw","stagg","stiffy","strapon","stringer","stripclub","stroke","stroking","stupid","stupidfuck","stupidfucker","suck","suckdick","sucker","suckme","suckmyass","suckmydick","suckmytit","suckoff","suicide","swallow","swallower","swalow","swastika","sweetness","syphilis","taboo","taff","tampon","tang","tantra","tarbaby","tard","teat","terror","terrorist","teste","testicle","testicles","thicklips","thirdeye","thirdleg","threesome","threeway","timbernigger","tinkle","tit","titbitnipply","titfuck","titfucker","titfuckin","titjob","titlicker","titlover","tits","tittie","titties","titty","tnt","toilet","tongethruster","tongue","tonguethrust","tonguetramp","tortur","torture","tosser","towelhead","trailertrash","tramp","trannie","tranny","transexual","transsexual","transvestite","triplex","trisexual","trojan","trots","tuckahoe","tunneloflove","turd","turnon","twat","twink","twinkie","twobitwhore","uck","uk","unfuckable","upskirt","uptheass","upthebutt","urinary","urinate","urine","usama","uterus","vagina","vaginal","vatican","vibr","vibrater","vibrator","vietcong","violence","virgin","virginbreaker","vomit","vulva","wab","wank","wanker","wanking","waysted","weapon","weenie","weewee","welcher","welfare","wetb","wetback","wetspot","whacker","whash","whigger","whiskey","whiskeydick","whiskydick","whit","whitenigger","whites","whitetrash","whitey","whiz","whop","whore","whorefucker","whorehouse","wigger","willie","williewanker","willy","wn","wog","women's","wop","wtf","wuss","wuzzie","xtc","xxx","yankee","yellowman","zigabo","zipperhead"]


  const handleSend = async () => {
    try{
      let censoredText = text;
      vulgarWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        censoredText = censoredText.replace(regex, '*'.repeat(word.length));
      });

      // const censoredText = censorWords(text);
      let messagePayload = {
        id: uuid(),
        text: censoredText,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        owner: true, // Set the owner flag to true for the messages you send
      };

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.error("Error uploading image:", error); 
        },
        async () => {
          try {
            // Wait for a short duration to ensure that the download URL is available
            await new Promise(resolve => setTimeout(resolve, 1000));

            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);


            await updateDoc(doc(db, "chatMessages", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            
          }
        }
      );
    } else if (gif) {
      await updateDoc(doc(db, "chatMessages", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          gif: gif.url, // Include the GIF URL in the message payload
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    else {
      await updateDoc(doc(db, "chatMessages", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: censoredText,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          owner: true,
        }),
      });
    } 

    await updateDoc(doc(db, "chatMetadata", data.chatId), {
      [data.chatId + ".lastMessage"]: {
        text:censoredText,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("  ");
    setImg(null);
    setGif(null);
   }catch (error) {
    console.error("Error sending message:", error);
    // TODO: Handle error, show error message to the user
  } 
};

const handleSelectGif = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=YOUR_GIPHY_API_KEY&limit=1`
    );
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const selectedGif = data.data[0];
      setGif(selectedGif);
    } else {
      console.error("No GIF found for the given search term:", searchTerm);
    }
  } catch (error) {
    console.error("Error selecting GIF:", error);
    // TODO: Handle error, show error message to the user
  }
};


  const handleEmojiClick = (event) => {
    console.log(event.emoji);
       setText(text+event.emoji);
  };
  
  

  return (
    <div className='input'>
    <div className="emoji-picker-container" style={{ display: showEmojiPicker ? 'block' : 'none' }}>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        navPosition="none"
        search={false} // Set search to false to remove the search bar
        grouped={true} // Set grouped to false to remove grouped categories
        showSkinTones={false} // Set showSkinTones to false to remove skin tone picker
      skinTone={null}
        native
        pickerStyle={{
          width: '195px',
          maxHeight: '100px',
          whiteSpace: 'nowrap',
          // padding: '8px',
          // borderRadius: '8px',
          // border: '1px solid #ccc',
          // backgroundColor: '#fff',
          // boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          fontSize: '10px'
        }}
        emojiSize={20}
        pickerClassName="custom-emoji-picker"
      />
    </div>
    <input type="text" placeholder='Type Something...' onChange={e => setText(e.target.value)} value={text} />
    <div className="send">
      <label htmlFor="file">
        <AiOutlineFile className='icons' size={25} />
      </label>
      <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
      <span className='icons' style={{ fontSize: '25px' }} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😀
      </span>
      <button onClick={handleSend}>Send</button>
    </div>
  </div>
  
  );
};

export default Input;
