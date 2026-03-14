// 內建單字資料庫 — 每個單字包含：word, phonetic, pos, meanings, examples, rootInfo
export const builtInWords = [
  {
    word: "abandon",
    phonetic: "/əˈbændən/",
    pos: "v.",
    meanings: ["放棄", "遺棄", "拋棄"],
    examples: [
      { en: "He decided to abandon the project after months of failure.", zh: "經過數月的失敗後，他決定放棄這個項目。" },
      { en: "The crew abandoned the sinking ship.", zh: "船員們棄離了正在下沉的船。" },
      { en: "She could not abandon her dreams so easily.", zh: "她不能如此輕易地放棄她的夢想。" }
    ],
    rootInfo: "a-(to) + bandon(control) → 放棄控制"
  },
  {
    word: "ability",
    phonetic: "/əˈbɪləti/",
    pos: "n.",
    meanings: ["能力", "才能"],
    examples: [
      { en: "She has the ability to solve complex problems.", zh: "她有解決複雜問題的能力。" },
      { en: "His ability in music was recognized early.", zh: "他的音樂才能很早就被認可了。" }
    ],
    rootInfo: "abil-(able) + -ity(名詞) → 能夠的狀態"
  },
  {
    word: "absorb",
    phonetic: "/əbˈzɔːrb/",
    pos: "v.",
    meanings: ["吸收", "吸引注意力"],
    examples: [
      { en: "Plants absorb sunlight to produce energy.", zh: "植物吸收陽光來產生能量。" },
      { en: "She was completely absorbed in the novel.", zh: "她完全沉浸在那本小說裡。" }
    ],
    rootInfo: "ab-(from) + sorb(suck in) → 從外部吸入"
  },
  {
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    pos: "v.",
    meanings: ["達成", "實現", "取得"],
    examples: [
      { en: "She worked hard to achieve her goals.", zh: "她努力工作以實現目標。" },
      { en: "The team achieved great success this season.", zh: "該隊本賽季取得了巨大的成功。" }
    ],
    rootInfo: "a-(to) + chieve(head/end) → 到達終點"
  },
  {
    word: "admire",
    phonetic: "/ədˈmaɪər/",
    pos: "v.",
    meanings: ["欽佩", "讚賞", "仰慕"],
    examples: [
      { en: "I admire her courage and determination.", zh: "我欽佩她的勇氣和決心。" },
      { en: "Tourists stopped to admire the beautiful scenery.", zh: "遊客們停下來欣賞美麗的風景。" }
    ],
    rootInfo: "ad-(at) + mir(wonder) → 驚嘆於"
  },
  {
    word: "adventure",
    phonetic: "/ədˈventʃər/",
    pos: "n.",
    meanings: ["冒險", "奇遇"],
    examples: [
      { en: "Life is either a daring adventure or nothing at all.", zh: "人生要嘛是一場大膽的冒險，要嘛什麼都不是。" },
      { en: "They set off on an adventure through the jungle.", zh: "他們踏上了穿越叢林的冒險旅程。" }
    ],
    rootInfo: "ad-(to) + vent(come) + -ure → 即將到來的事"
  },
  {
    word: "anxiety",
    phonetic: "/æŋˈzaɪəti/",
    pos: "n.",
    meanings: ["焦慮", "不安", "擔憂"],
    examples: [
      { en: "She felt a growing sense of anxiety before the exam.", zh: "考試前她感到越來越焦慮。" },
      { en: "His anxiety about the future kept him awake at night.", zh: "他對未來的擔憂讓他夜不能寐。" }
    ],
    rootInfo: "anxi-(choke/distress) + -ety → 令人窒息的感覺"
  },
  {
    word: "appreciate",
    phonetic: "/əˈpriːʃieɪt/",
    pos: "v.",
    meanings: ["欣賞", "感激", "理解"],
    examples: [
      { en: "I really appreciate your help with this project.", zh: "我真的很感激你在這個項目上的幫助。" },
      { en: "You need to appreciate the value of hard work.", zh: "你需要理解努力工作的價值。" }
    ],
    rootInfo: "ap-(to) + preci(price/value) + -ate → 認識到價值"
  },
  {
    word: "brilliant",
    phonetic: "/ˈbrɪliənt/",
    pos: "adj.",
    meanings: ["傑出的", "輝煌的", "明亮的"],
    examples: [
      { en: "She came up with a brilliant idea.", zh: "她想出了一個傑出的點子。" },
      { en: "The sky was filled with brilliant colors at sunset.", zh: "日落時天空佈滿了燦爛的色彩。" }
    ],
    rootInfo: "brill-(sparkle) + -iant → 閃閃發光的"
  },
  {
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    pos: "n./v.",
    meanings: ["挑戰", "質疑"],
    examples: [
      { en: "Learning a new language is always a challenge.", zh: "學習一門新語言總是一個挑戰。" },
      { en: "She challenged him to a game of chess.", zh: "她向他發起了一場國際象棋挑戰。" }
    ],
    rootInfo: "calumnia(false accusation) → 古法語 chalenge"
  },
  {
    word: "collaborate",
    phonetic: "/kəˈlæbəreɪt/",
    pos: "v.",
    meanings: ["合作", "協作"],
    examples: [
      { en: "Scientists from different countries collaborate on this research.", zh: "來自不同國家的科學家合作進行這項研究。" },
      { en: "We need to collaborate more effectively as a team.", zh: "我們需要更有效地團隊合作。" }
    ],
    rootInfo: "col-(together) + labor(work) + -ate → 一起工作"
  },
  {
    word: "confident",
    phonetic: "/ˈkɒnfɪdənt/",
    pos: "adj.",
    meanings: ["自信的", "有信心的"],
    examples: [
      { en: "She felt confident about passing the test.", zh: "她對通過考試感到有信心。" },
      { en: "A confident speaker can engage any audience.", zh: "一個自信的演講者可以吸引任何觀眾。" }
    ],
    rootInfo: "con-(with) + fid(trust) + -ent → 帶有信任的"
  },
  {
    word: "consequence",
    phonetic: "/ˈkɒnsɪkwəns/",
    pos: "n.",
    meanings: ["後果", "結果", "重要性"],
    examples: [
      { en: "You must accept the consequences of your actions.", zh: "你必須接受你行為帶來的後果。" },
      { en: "The decision had far-reaching consequences.", zh: "這個決定產生了深遠的影響。" }
    ],
    rootInfo: "con-(together) + sequ(follow) + -ence → 隨之而來的"
  },
  {
    word: "creative",
    phonetic: "/kriˈeɪtɪv/",
    pos: "adj.",
    meanings: ["有創造力的", "創意的"],
    examples: [
      { en: "She is one of the most creative designers in the industry.", zh: "她是業界最有創造力的設計師之一。" },
      { en: "Creative thinking is essential for solving complex problems.", zh: "創造性思維對於解決複雜問題至關重要。" }
    ],
    rootInfo: "creat(make/produce) + -ive → 善於創造的"
  },
  {
    word: "curious",
    phonetic: "/ˈkjʊəriəs/",
    pos: "adj.",
    meanings: ["好奇的", "奇怪的"],
    examples: [
      { en: "Children are naturally curious about the world.", zh: "孩子們天生對世界充滿好奇。" },
      { en: "It was curious that nobody noticed the mistake.", zh: "奇怪的是沒有人注意到這個錯誤。" }
    ],
    rootInfo: "cur(care) + -ious → 充滿關心的 → 好奇的"
  },
  {
    word: "demonstrate",
    phonetic: "/ˈdemənstreɪt/",
    pos: "v.",
    meanings: ["展示", "證明", "示威"],
    examples: [
      { en: "The experiment demonstrated the power of teamwork.", zh: "這個實驗展示了團隊合作的力量。" },
      { en: "Can you demonstrate how this machine works?", zh: "你能演示一下這台機器怎麼運作嗎？" }
    ],
    rootInfo: "de-(fully) + monstr(show) + -ate → 充分展示"
  },
  {
    word: "determine",
    phonetic: "/dɪˈtɜːrmɪn/",
    pos: "v.",
    meanings: ["決定", "確定", "下定決心"],
    examples: [
      { en: "We need to determine the cause of the problem.", zh: "我們需要確定問題的原因。" },
      { en: "She was determined to finish the marathon.", zh: "她下定決心要完成馬拉松。" }
    ],
    rootInfo: "de-(completely) + termin(limit/end) → 完全劃定界限"
  },
  {
    word: "elegant",
    phonetic: "/ˈelɪɡənt/",
    pos: "adj.",
    meanings: ["優雅的", "精緻的"],
    examples: [
      { en: "She wore an elegant dress to the gala.", zh: "她穿著一件優雅的禮服去參加晚會。" },
      { en: "The solution was simple yet elegant.", zh: "這個解決方案簡單而優雅。" }
    ],
    rootInfo: "e-(out) + leg(choose) + -ant → 精心挑選的"
  },
  {
    word: "embrace",
    phonetic: "/ɪmˈbreɪs/",
    pos: "v./n.",
    meanings: ["擁抱", "欣然接受"],
    examples: [
      { en: "She embraced the new challenge with enthusiasm.", zh: "她滿腔熱情地接受了新的挑戰。" },
      { en: "They held each other in a warm embrace.", zh: "他們相互溫暖地擁抱著。" }
    ],
    rootInfo: "em-(in) + brace(arms) → 放入懷中"
  },
  {
    word: "enormous",
    phonetic: "/ɪˈnɔːrməs/",
    pos: "adj.",
    meanings: ["巨大的", "龐大的"],
    examples: [
      { en: "The project required an enormous amount of funding.", zh: "這個項目需要大量的資金。" },
      { en: "An enormous whale surfaced near the boat.", zh: "一條巨大的鯨魚在船邊浮出水面。" }
    ],
    rootInfo: "e-(out of) + norm(rule) + -ous → 超出常規的"
  },
  {
    word: "essential",
    phonetic: "/ɪˈsenʃl/",
    pos: "adj.",
    meanings: ["必要的", "本質的", "基本的"],
    examples: [
      { en: "Water is essential for all living things.", zh: "水對所有生物都是必不可少的。" },
      { en: "It is essential that we act quickly.", zh: "我們必須迅速行動。" }
    ],
    rootInfo: "ess(being) + -ential → 存在所必需的"
  },
  {
    word: "fascinating",
    phonetic: "/ˈfæsɪneɪtɪŋ/",
    pos: "adj.",
    meanings: ["迷人的", "極有吸引力的"],
    examples: [
      { en: "The documentary was absolutely fascinating.", zh: "這部紀錄片實在太迷人了。" },
      { en: "She told us a fascinating story about her travels.", zh: "她給我們講了一個關於她旅行的迷人故事。" }
    ],
    rootInfo: "fascin(enchant) + -ating → 如被施了魔法般的"
  },
  {
    word: "flourish",
    phonetic: "/ˈflʌrɪʃ/",
    pos: "v.",
    meanings: ["繁榮", "茂盛", "活躍"],
    examples: [
      { en: "The business began to flourish after the new strategy.", zh: "採用新策略後，業務開始蓬勃發展。" },
      { en: "Desert flowers flourish after the rain.", zh: "沙漠之花在雨後盛開。" }
    ],
    rootInfo: "flor(flower) + -ish → 像花一樣綻放"
  },
  {
    word: "genuine",
    phonetic: "/ˈdʒenjuɪn/",
    pos: "adj.",
    meanings: ["真正的", "真誠的"],
    examples: [
      { en: "She showed genuine concern for her colleagues.", zh: "她對同事表現出真誠的關心。" },
      { en: "Is this painting genuine or a copy?", zh: "這幅畫是真跡還是複製品？" }
    ],
    rootInfo: "genu-(birth/origin) + -ine → 源於本初的"
  },
  {
    word: "gratitude",
    phonetic: "/ˈɡrætɪtjuːd/",
    pos: "n.",
    meanings: ["感激", "感恩"],
    examples: [
      { en: "She expressed her gratitude for their support.", zh: "她對他們的支持表示感激。" },
      { en: "A small gift as a token of gratitude.", zh: "一份小禮物作為感謝的象徵。" }
    ],
    rootInfo: "grat(pleasing/thankful) + -itude → 感恩的狀態"
  },
  {
    word: "harmony",
    phonetic: "/ˈhɑːrməni/",
    pos: "n.",
    meanings: ["和諧", "協調", "融洽"],
    examples: [
      { en: "The team worked together in perfect harmony.", zh: "團隊完美和諧地協作。" },
      { en: "We must live in harmony with nature.", zh: "我們必須與自然和諧共處。" }
    ],
    rootInfo: "harmon(fitting together) + -y → 完美配合"
  },
  {
    word: "hesitate",
    phonetic: "/ˈhezɪteɪt/",
    pos: "v.",
    meanings: ["猶豫", "遲疑"],
    examples: [
      { en: "Don't hesitate to ask if you need help.", zh: "如果你需要幫助，別猶豫盡管問。" },
      { en: "She hesitated before answering the question.", zh: "她在回答問題前猶豫了一下。" }
    ],
    rootInfo: "haes(stick) + -itate → 像被黏住一樣停滯不前"
  },
  {
    word: "illustrate",
    phonetic: "/ˈɪləstreɪt/",
    pos: "v.",
    meanings: ["說明", "闡明", "加插圖"],
    examples: [
      { en: "The chart illustrates the growth trend clearly.", zh: "這張圖表清楚地說明了增長趨勢。" },
      { en: "She used examples to illustrate her point.", zh: "她用例子來闡明她的觀點。" }
    ],
    rootInfo: "il-(upon) + lustr(light) + -ate → 照亮 → 使清楚"
  },
  {
    word: "inevitable",
    phonetic: "/ɪnˈevɪtəbl/",
    pos: "adj.",
    meanings: ["不可避免的", "必然的"],
    examples: [
      { en: "Change is inevitable in any growing company.", zh: "在任何成長中的公司，變化是不可避免的。" },
      { en: "It was inevitable that they would eventually meet again.", zh: "他們最終會再次相遇是必然的。" }
    ],
    rootInfo: "in-(not) + e-(out) + vit(avoid) + -able → 無法避開的"
  },
  {
    word: "inspire",
    phonetic: "/ɪnˈspaɪər/",
    pos: "v.",
    meanings: ["啟發", "激勵", "鼓舞"],
    examples: [
      { en: "Her speech inspired thousands of young people.", zh: "她的演講激勵了數千名年輕人。" },
      { en: "The beautiful landscape inspired the painter.", zh: "美麗的風景啟發了那位畫家。" }
    ],
    rootInfo: "in-(into) + spir(breathe) → 注入氣息/靈感"
  },
  {
    word: "journey",
    phonetic: "/ˈdʒɜːrni/",
    pos: "n.",
    meanings: ["旅程", "歷程"],
    examples: [
      { en: "The journey of a thousand miles begins with a single step.", zh: "千里之行始於足下。" },
      { en: "Learning is a lifelong journey.", zh: "學習是一段終身的旅程。" }
    ],
    rootInfo: "jour(day) + -ney → 一天的旅行"
  },
  {
    word: "magnificent",
    phonetic: "/mæɡˈnɪfɪsnt/",
    pos: "adj.",
    meanings: ["壯麗的", "壯觀的", "極好的"],
    examples: [
      { en: "The view from the mountain top was magnificent.", zh: "從山頂看到的景色十分壯觀。" },
      { en: "The cathedral has a magnificent stained glass window.", zh: "這座大教堂有一扇壯麗的彩色玻璃窗。" }
    ],
    rootInfo: "magn(great) + -ific(making) + -ent → 令人感到偉大的"
  },
  {
    word: "mysterious",
    phonetic: "/mɪˈstɪəriəs/",
    pos: "adj.",
    meanings: ["神秘的", "不可思議的"],
    examples: [
      { en: "A mysterious stranger appeared at the door.", zh: "一個神秘的陌生人出現在門口。" },
      { en: "The disappearance remained mysterious for decades.", zh: "消失事件幾十年來一直是個謎。" }
    ],
    rootInfo: "myster(secret rite) + -ious → 充滿秘密的"
  },
  {
    word: "negotiate",
    phonetic: "/nɪˈɡəʊʃieɪt/",
    pos: "v.",
    meanings: ["談判", "協商", "磋商"],
    examples: [
      { en: "Both sides agreed to negotiate a peace deal.", zh: "雙方同意就和平協議進行談判。" },
      { en: "She negotiated a higher salary for herself.", zh: "她為自己爭取到了更高的薪水。" }
    ],
    rootInfo: "neg-(not) + oti(leisure) + -ate → 非休閒 → 忙於交涉"
  },
  {
    word: "obstacle",
    phonetic: "/ˈɒbstəkl/",
    pos: "n.",
    meanings: ["障礙", "阻礙"],
    examples: [
      { en: "Lack of funding is the biggest obstacle to progress.", zh: "缺乏資金是進步的最大障礙。" },
      { en: "She overcame every obstacle in her path.", zh: "她克服了路上的每一個障礙。" }
    ],
    rootInfo: "ob-(against) + sta(stand) + -cle → 站在前面的東西"
  },
  {
    word: "passion",
    phonetic: "/ˈpæʃn/",
    pos: "n.",
    meanings: ["熱情", "激情", "酷愛"],
    examples: [
      { en: "He pursued his passion for music throughout his life.", zh: "他一生都在追求對音樂的熱情。" },
      { en: "Teaching is not just a job — it's her passion.", zh: "教學不只是一份工作——是她的熱情所在。" }
    ],
    rootInfo: "pass(suffer/feel) + -ion → 強烈的情感"
  },
  {
    word: "persevere",
    phonetic: "/ˌpɜːrsɪˈvɪər/",
    pos: "v.",
    meanings: ["堅持不懈", "鍥而不捨"],
    examples: [
      { en: "If you persevere, you will eventually succeed.", zh: "如果你堅持不懈，最終會成功。" },
      { en: "She persevered despite all the difficulties.", zh: "儘管困難重重，她仍然堅持不懈。" }
    ],
    rootInfo: "per-(through) + sever(strict/serious) → 始終嚴格堅持"
  },
  {
    word: "phenomenon",
    phonetic: "/fɪˈnɒmɪnən/",
    pos: "n.",
    meanings: ["現象", "奇蹟", "非凡之事"],
    examples: [
      { en: "The northern lights are a natural phenomenon.", zh: "北極光是一種自然現象。" },
      { en: "Social media has become a global phenomenon.", zh: "社交媒體已成為一個全球性的現象。" }
    ],
    rootInfo: "phainomenon(that which appears) → 顯現之物"
  },
  {
    word: "profound",
    phonetic: "/prəˈfaʊnd/",
    pos: "adj.",
    meanings: ["深刻的", "深遠的", "極度的"],
    examples: [
      { en: "The book had a profound impact on my thinking.", zh: "這本書對我的思維產生了深刻的影響。" },
      { en: "She spoke with profound wisdom.", zh: "她說話時充滿了深刻的智慧。" }
    ],
    rootInfo: "pro-(forward) + fund(bottom) → 到達底部的 → 深刻的"
  },
  {
    word: "resilient",
    phonetic: "/rɪˈzɪliənt/",
    pos: "adj.",
    meanings: ["有彈性的", "適應力強的"],
    examples: [
      { en: "Children are incredibly resilient and adaptable.", zh: "孩子們有著驚人的適應力和彈性。" },
      { en: "The economy proved more resilient than expected.", zh: "經濟表現得比預期更有韌性。" }
    ],
    rootInfo: "re-(back) + sili(jump) + -ent → 彈回的"
  },
  {
    word: "significant",
    phonetic: "/sɪɡˈnɪfɪkənt/",
    pos: "adj.",
    meanings: ["重要的", "顯著的", "有意義的"],
    examples: [
      { en: "There has been a significant increase in sales.", zh: "銷售額有了顯著的增長。" },
      { en: "This is a significant moment in history.", zh: "這是歷史上一個重要的時刻。" }
    ],
    rootInfo: "sign(mark) + -ific(making) + -ant → 值得標記的"
  },
  {
    word: "sophisticated",
    phonetic: "/səˈfɪstɪkeɪtɪd/",
    pos: "adj.",
    meanings: ["精密的", "老練的", "高雅的"],
    examples: [
      { en: "The software uses sophisticated algorithms.", zh: "該軟體使用了精密的演算法。" },
      { en: "She has a sophisticated taste in art.", zh: "她在藝術方面有高雅的品味。" }
    ],
    rootInfo: "soph(wise) + -isticated → 變得世故/有智慧的"
  },
  {
    word: "sustainable",
    phonetic: "/səˈsteɪnəbl/",
    pos: "adj.",
    meanings: ["可持續的", "永續的"],
    examples: [
      { en: "We need to find more sustainable energy sources.", zh: "我們需要尋找更可持續的能源。" },
      { en: "Sustainable development is key to our future.", zh: "永續發展是我們未來的關鍵。" }
    ],
    rootInfo: "sus-(under) + tain(hold) + -able → 能從下方支撐的"
  },
  {
    word: "transform",
    phonetic: "/trænsˈfɔːrm/",
    pos: "v.",
    meanings: ["轉變", "改造", "使變形"],
    examples: [
      { en: "Technology has transformed the way we communicate.", zh: "科技改變了我們溝通的方式。" },
      { en: "The caterpillar transforms into a butterfly.", zh: "毛毛蟲蛻變成蝴蝶。" }
    ],
    rootInfo: "trans-(across) + form(shape) → 改變形狀"
  },
  {
    word: "unique",
    phonetic: "/juˈniːk/",
    pos: "adj.",
    meanings: ["獨特的", "唯一的"],
    examples: [
      { en: "Every snowflake has a unique pattern.", zh: "每片雪花都有獨特的圖案。" },
      { en: "She brings a unique perspective to the team.", zh: "她為團隊帶來了獨特的視角。" }
    ],
    rootInfo: "uni(one) + -que → 僅此一個的"
  },
  {
    word: "versatile",
    phonetic: "/ˈvɜːrsətaɪl/",
    pos: "adj.",
    meanings: ["多才多藝的", "多功能的"],
    examples: [
      { en: "She is a versatile actress who can play any role.", zh: "她是一位多才多藝的女演員，能飾演任何角色。" },
      { en: "This tool is incredibly versatile.", zh: "這個工具用途極為廣泛。" }
    ],
    rootInfo: "vers(turn) + -atile → 能靈活轉換的"
  },
  {
    word: "vivid",
    phonetic: "/ˈvɪvɪd/",
    pos: "adj.",
    meanings: ["生動的", "鮮明的", "逼真的"],
    examples: [
      { en: "She painted a vivid picture of life in the countryside.", zh: "她生動地描繪了鄉村生活。" },
      { en: "I still have vivid memories of that summer.", zh: "我對那個夏天仍然記憶猶新。" }
    ],
    rootInfo: "viv(live) + -id → 充滿生命力的"
  },
  {
    word: "vulnerable",
    phonetic: "/ˈvʌlnərəbl/",
    pos: "adj.",
    meanings: ["脆弱的", "易受傷的"],
    examples: [
      { en: "Children are especially vulnerable to pollution.", zh: "兒童對污染特別脆弱。" },
      { en: "The castle was vulnerable to attack from the north.", zh: "這座城堡容易從北面受到攻擊。" }
    ],
    rootInfo: "vulner(wound) + -able → 容易被傷害的"
  },
  {
    word: "wisdom",
    phonetic: "/ˈwɪzdəm/",
    pos: "n.",
    meanings: ["智慧", "才智", "明智"],
    examples: [
      { en: "With age comes wisdom.", zh: "隨著年齡的增長，智慧也隨之而來。" },
      { en: "She shared her wisdom with younger colleagues.", zh: "她與年輕同事分享了她的智慧。" }
    ],
    rootInfo: "wis(wise) + -dom(state) → 明智的狀態"
  },
  {
    word: "ambiguous",
    phonetic: "/æmˈbɪɡjuəs/",
    pos: "adj.",
    meanings: ["模糊的", "含糊不清的"],
    examples: [
      { en: "The instructions were ambiguous and confusing.", zh: "這些指示含糊不清，令人困惑。" },
      { en: "His answer was deliberately ambiguous.", zh: "他的回答是故意模棱兩可的。" }
    ],
    rootInfo: "ambi-(both) + ag(drive) + -uous → 被驅向兩邊的"
  },
  {
    word: "contemplate",
    phonetic: "/ˈkɒntəmpleɪt/",
    pos: "v.",
    meanings: ["沉思", "深思熟慮", "注視"],
    examples: [
      { en: "She sat quietly to contemplate her next move.", zh: "她安靜地坐著，深思她的下一步。" },
      { en: "He contemplated the stars in the night sky.", zh: "他凝視著夜空中的星星。" }
    ],
    rootInfo: "con-(with) + templ(temple/space for observation) + -ate → 在觀察空間中思考"
  },
  {
    word: "diligent",
    phonetic: "/ˈdɪlɪdʒənt/",
    pos: "adj.",
    meanings: ["勤勉的", "勤奮的"],
    examples: [
      { en: "She is a diligent student who always completes her work on time.", zh: "她是一個勤勉的學生，總是按時完成作業。" },
      { en: "Their diligent efforts paid off in the end.", zh: "他們辛勤的努力最終有了回報。" }
    ],
    rootInfo: "di-(apart) + lig(choose) + -ent → 精挑細選地做事"
  },
  {
    word: "eloquent",
    phonetic: "/ˈeləkwənt/",
    pos: "adj.",
    meanings: ["雄辯的", "有說服力的"],
    examples: [
      { en: "He gave an eloquent speech at the ceremony.", zh: "他在典禮上發表了一場雄辯的演講。" },
      { en: "Her silence was more eloquent than words.", zh: "她的沉默比言語更有說服力。" }
    ],
    rootInfo: "e-(out) + loqu(speak) + -ent → 說出來的 → 善於表達"
  },
  {
    word: "hypothesis",
    phonetic: "/haɪˈpɒθəsɪs/",
    pos: "n.",
    meanings: ["假說", "假設"],
    examples: [
      { en: "The scientist tested her hypothesis through experiments.", zh: "這位科學家通過實驗來驗證她的假說。" },
      { en: "It's just a hypothesis — we need more evidence.", zh: "這只是一個假設——我們需要更多的證據。" }
    ],
    rootInfo: "hypo-(under) + thesis(placing) → 放在下面作為基礎的假定"
  },
  {
    word: "integrity",
    phonetic: "/ɪnˈteɡrəti/",
    pos: "n.",
    meanings: ["正直", "誠實", "完整性"],
    examples: [
      { en: "He is known for his integrity in business.", zh: "他以在商業中的正直而聞名。" },
      { en: "The structural integrity of the building was compromised.", zh: "建築的結構完整性受到了破壞。" }
    ],
    rootInfo: "integr(whole/untouched) + -ity → 完整無缺的狀態"
  },
  {
    word: "meticulous",
    phonetic: "/mɪˈtɪkjələs/",
    pos: "adj.",
    meanings: ["一絲不苟的", "非常仔細的"],
    examples: [
      { en: "She is meticulous about keeping records.", zh: "她在記錄方面非常一絲不苟。" },
      { en: "The painting required meticulous attention to detail.", zh: "這幅畫需要對細節一絲不苟的關注。" }
    ],
    rootInfo: "metus(fear) + -iculous → 因害怕出錯而非常仔細"
  },
  {
    word: "nostalgia",
    phonetic: "/nɒˈstældʒə/",
    pos: "n.",
    meanings: ["懷舊", "鄉愁"],
    examples: [
      { en: "The old songs filled her with nostalgia.", zh: "那些老歌讓她充滿了懷舊之情。" },
      { en: "There's a sense of nostalgia in his latest novel.", zh: "他最新的小說中有一種懷舊感。" }
    ],
    rootInfo: "nost(return home) + -algia(pain) → 回家的渴望之痛"
  },
  {
    word: "paradigm",
    phonetic: "/ˈpærədaɪm/",
    pos: "n.",
    meanings: ["典範", "範式", "模式"],
    examples: [
      { en: "This discovery represents a paradigm shift in science.", zh: "這個發現代表了科學中的典範轉移。" },
      { en: "We need a new paradigm for education.", zh: "我們需要一個新的教育範式。" }
    ],
    rootInfo: "para-(beside) + deigma(pattern/example) → 放在旁邊作為對比的模式"
  },
  {
    word: "ubiquitous",
    phonetic: "/juːˈbɪkwɪtəs/",
    pos: "adj.",
    meanings: ["無處不在的", "普遍存在的"],
    examples: [
      { en: "Smartphones have become ubiquitous in modern life.", zh: "智能手機在現代生活中已經無處不在。" },
      { en: "Coffee shops are ubiquitous in this city.", zh: "咖啡店在這座城市隨處可見。" }
    ],
    rootInfo: "ubique(everywhere) + -ous → 到處都是的"
  },
  {
    word: "tenacity",
    phonetic: "/tɪˈnæsɪti/",
    pos: "n.",
    meanings: ["堅韌", "頑強", "不屈不撓"],
    examples: [
      { en: "Her tenacity helped her overcome every setback.", zh: "她的堅韌幫助她克服了每一次挫折。" },
      { en: "Success requires talent and tenacity in equal measure.", zh: "成功需要天賦和堅韌各佔一半。" }
    ],
    rootInfo: "ten(hold) + -acity → 緊緊抓住不放的特質"
  },
  {
    word: "serendipity",
    phonetic: "/ˌserənˈdɪpɪti/",
    pos: "n.",
    meanings: ["意外之喜", "意外發現美好事物的能力"],
    examples: [
      { en: "Finding this café was pure serendipity.", zh: "發現這家咖啡館純屬意外之喜。" },
      { en: "Many scientific discoveries are the result of serendipity.", zh: "許多科學發現都是機緣巧合的結果。" }
    ],
    rootInfo: "Serendip(斯里蘭卡古名) + -ity → 源自童話《三王子》的意外發現"
  },
  {
    word: "empathy",
    phonetic: "/ˈempəθi/",
    pos: "n.",
    meanings: ["同理心", "共鳴"],
    examples: [
      { en: "A good leader shows empathy toward their team.", zh: "一個好的領導者會對團隊展現同理心。" },
      { en: "She felt deep empathy for the refugees.", zh: "她對難民們深表同情。" }
    ],
    rootInfo: "em-(in) + path(feeling) + -y → 感同身受"
  },
  {
    word: "pragmatic",
    phonetic: "/præɡˈmætɪk/",
    pos: "adj.",
    meanings: ["務實的", "實用主義的"],
    examples: [
      { en: "We need a pragmatic approach to solve this problem.", zh: "我們需要一個務實的方法來解決這個問題。" },
      { en: "She is known for her pragmatic leadership style.", zh: "她以務實的領導風格著稱。" }
    ],
    rootInfo: "pragma(deed/act) + -tic → 關注實際行動的"
  },
  {
    word: "ephemeral",
    phonetic: "/ɪˈfemərəl/",
    pos: "adj.",
    meanings: ["短暫的", "瞬息的"],
    examples: [
      { en: "Fame can be ephemeral — here today, gone tomorrow.", zh: "名聲可以是短暫的——今天在這裡，明天就消失了。" },
      { en: "Cherry blossoms are beautiful but ephemeral.", zh: "櫻花美麗但短暫。" }
    ],
    rootInfo: "epi-(upon) + hemer(day) + -al → 只存在一天的"
  }
];
