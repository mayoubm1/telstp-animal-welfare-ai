-- Professional owner-facing curriculum and guidance for TELSTP.
-- Deliberately excludes ratings, review counts, testimonials, and other user-generated claims.

INSERT INTO trainingPrograms
  (name, nameAr, category, description, descriptionAr, difficulty, ageRange, duration, steps, stepsAr, tips, tipsAr, successIndicators, successIndicatorsAr)
VALUES
(
  'Bathroom Training Basics',
  'أساسيات تدريب قضاء الحاجة',
  'bathroom_training',
  'A consistent, reward-based routine for puppies and adult dogs. The program focuses on timing, supervision, environmental setup, and calm accident recovery.',
  'روتين ثابت قائم على المكافأة للجراء والكلاب البالغة. يركز البرنامج على التوقيت والإشراف وتجهيز البيئة والتعامل الهادئ مع الحوادث.',
  'beginner', '8 weeks and older', 30,
  '[{"step":1,"title":"Set the routine","description":"Offer outdoor breaks after waking, eating, drinking, playing, and sleeping."},{"step":2,"title":"Use one clear location","description":"Take the dog to the same safe area and wait quietly for the behavior."},{"step":3,"title":"Reward immediately","description":"Praise calmly and reward within seconds of successful elimination."},{"step":4,"title":"Supervise and reset","description":"If an accident happens, clean without punishment and shorten the next interval."}]',
  '[{"step":1,"title":"ضع الروتين","description":"وفر فرصاً للخروج بعد الاستيقاظ والأكل والشرب واللعب والنوم."},{"step":2,"title":"استخدم مكاناً واضحاً","description":"اصطحب الكلب إلى المكان الآمن نفسه وانتظر بهدوء."},{"step":3,"title":"كافئ فوراً","description":"امدح بهدوء وكافئ خلال ثوانٍ من النجاح."},{"step":4,"title":"راقب وأعد الضبط","description":"نظف الحادثة دون عقاب وقلل الفاصل التالي."}]',
  '["Keep a written schedule for the first week","Use the same cue and reward each time","Ask a veterinarian about sudden regression or excessive urination"]',
  '["احتفظ بجدول مكتوب في الأسبوع الأول","استخدم الإشارة والمكافأة نفسيهما","استشر الطبيب عند التراجع المفاجئ أو كثرة التبول"]',
  '["Accidents decrease across two consecutive weeks","The dog uses the designated area with fewer prompts"]',
  '["انخفاض الحوادث لمدة أسبوعين متتاليين","استخدام المكان المحدد مع عدد أقل من التوجيهات"]'
),
(
  'Foundations of Obedience',
  'أساسيات الطاعة والتواصل',
  'obedience',
  'A practical foundation for name response, sit, wait, and recall using short sessions, clear cues, and reinforcement that the dog values.',
  'أساس عملي للاستجابة للاسم والجلوس والانتظار والعودة باستخدام جلسات قصيرة وإشارات واضحة وتعزيز مناسب للكلب.',
  'beginner', '12 weeks and older', 21,
  '[{"step":1,"title":"Build name response","description":"Say the name once, mark eye contact, and reward immediately."},{"step":2,"title":"Teach a hand target","description":"Reward the nose touching an open hand to create a reliable communication tool."},{"step":3,"title":"Add sit and wait","description":"Reward small durations first, then increase distance and distractions gradually."},{"step":4,"title":"Practice recall safely","description":"Use a long line outdoors and never punish the dog for returning."}]',
  '[{"step":1,"title":"ابنِ الاستجابة للاسم","description":"قل الاسم مرة واحدة وكافئ التواصل البصري فوراً."},{"step":2,"title":"علّم لمس اليد","description":"كافئ لمس الأنف لليد المفتوحة لبناء وسيلة تواصل ثابتة."},{"step":3,"title":"أضف الجلوس والانتظار","description":"ابدأ بمدد قصيرة ثم زد المسافة والمشتتات تدريجياً."},{"step":4,"title":"تدرب على العودة بأمان","description":"استخدم حبل تدريب في الخارج ولا تعاقب الكلب عند عودته."}]',
  '["Train for three to five minutes at a time","End while the dog is still engaged","Use management tools when a behavior is not yet reliable"]',
  '["تدرب من ثلاث إلى خمس دقائق في المرة","أنه الجلسة بينما لا يزال الكلب متفاعلاً","استخدم أدوات الإدارة عندما لا يكون السلوك ثابتاً بعد"]',
  '["The dog responds to its name indoors","The dog can wait briefly and return on a long line"]',
  '["استجابة الكلب لاسمه داخل المنزل","قدرة الكلب على الانتظار والعودة بحبل تدريب"]'
),
(
  'Safe Socialization Plan',
  'خطة التنشئة الاجتماعية الآمنة',
  'socialization',
  'A gradual exposure plan for puppies, rescued animals, and adult pets that prioritizes choice, distance, recovery, and positive associations.',
  'خطة تعرض تدريجية للجراء والحيوانات التي تم إنقاذها والحيوانات البالغة، مع أولوية الاختيار والمسافة والتعافي والارتباط الإيجابي.',
  'beginner', '8 weeks and older', 28,
  '[{"step":1,"title":"List the environments","description":"Write down sounds, surfaces, people, animals, transport, and handling experiences."},{"step":2,"title":"Start below threshold","description":"Begin at a distance where the pet can still eat, look away, and recover."},{"step":3,"title":"Pair and pause","description":"Pair the experience with food or play, then leave before stress builds."},{"step":4,"title":"Increase one variable","description":"Change only distance, duration, or intensity at a time."}]',
  '[{"step":1,"title":"اكتب البيئات","description":"سجل الأصوات والأسطح والأشخاص والحيوانات والنقل وتجارب التعامل."},{"step":2,"title":"ابدأ تحت حد التوتر","description":"ابدأ من مسافة يستطيع عندها الحيوان الأكل والتعافي."},{"step":3,"title":"اربط وتوقف","description":"اربط التجربة بالطعام أو اللعب ثم غادر قبل ارتفاع التوتر."},{"step":4,"title":"زد متغيراً واحداً","description":"غير المسافة أو المدة أو الشدة، وليس كلها معاً."}]',
  '["Never force contact","Give the pet a predictable escape route","Pause and seek professional help if fear escalates"]',
  '["لا تجبر الحيوان على التلامس","وفر طريق انسحاب متوقعاً","توقف واطلب مساعدة متخصصة عند تصاعد الخوف"]',
  '["The pet can observe and recover without prolonged distress","The pet chooses to re-engage with the environment"]',
  '["قدرة الحيوان على الملاحظة والتعافي دون ضيق طويل","اختيار الحيوان العودة إلى التفاعل مع البيئة"]'
),
(
  'Indoor Cat Enrichment',
  'إثراء القطط داخل المنزل',
  'play_enrichment',
  'A weekly enrichment routine using movement, foraging, climbing, scratching, and quiet observation to support feline welfare indoors.',
  'روتين أسبوعي لإثراء حياة القطط باستخدام الحركة والبحث عن الطعام والتسلق والخدش والمراقبة الهادئة لدعم رفاهيتها داخل المنزل.',
  'beginner', 'All ages', 14,
  '[{"step":1,"title":"Map the resources","description":"Provide separated food, water, litter, resting, hiding, and scratching areas."},{"step":2,"title":"Rotate activities","description":"Offer short play sessions and rotate safe toys to preserve interest."},{"step":3,"title":"Add foraging","description":"Use measured food in simple puzzles or scatter feeding when appropriate."},{"step":4,"title":"Observe preferences","description":"Track what the cat chooses and adjust without forcing interaction."}]',
  '[{"step":1,"title":"وزع الموارد","description":"وفر الطعام والماء وصندوق الفضلات والراحة والاختباء والخدش في أماكن منفصلة."},{"step":2,"title":"بدل الأنشطة","description":"وفر جلسات لعب قصيرة وبدل الألعاب الآمنة للحفاظ على الاهتمام."},{"step":3,"title":"أضف البحث عن الطعام","description":"استخدم كمية محسوبة في ألعاب بسيطة عند ملاءمتها."},{"step":4,"title":"راقب التفضيلات","description":"سجل ما تختاره القطة وعدل الروتين دون إجبار."}]',
  '["Keep play sessions short and predictable","Avoid strings or small parts that can be swallowed","Discuss sudden changes in appetite or litter use with a veterinarian"]',
  '["اجعل جلسات اللعب قصيرة ومتوقعة","تجنب الخيوط والأجزاء الصغيرة القابلة للابتلاع","ناقش التغير المفاجئ في الشهية أو استخدام الصندوق مع الطبيب"]',
  '["The cat uses more than one enrichment option each week","Resting, play, and litter patterns remain stable"]',
  '["استخدام القطة لأكثر من نشاط إثراء أسبوعياً","استقرار أنماط الراحة واللعب واستخدام الصندوق"]'
),
(
  'Cooperative Grooming and Handling',
  'العناية والتعامل التعاوني',
  'behavioral_modification',
  'A low-pressure plan for brushing, paw checks, ear observation, and carrier practice. Stop before fear or defensive behavior escalates.',
  'خطة هادئة للتمشيط وفحص الكفوف ومراقبة الأذن والتدرب على الحقيبة. توقف قبل تصاعد الخوف أو السلوك الدفاعي.',
  'intermediate', 'All ages', 21,
  '[{"step":1,"title":"Create a consent cue","description":"Teach the pet that approaching a mat or hand starts and stops handling."},{"step":2,"title":"Touch briefly","description":"Touch one area for one second, reward, and release."},{"step":3,"title":"Add the tool","description":"Show the brush or carrier separately before using it for one brief repetition."},{"step":4,"title":"Build a clinic-ready routine","description":"Practice calm entry, weighing, and gentle restraint with a veterinary team when needed."}]',
  '[{"step":1,"title":"أنشئ إشارة موافقة","description":"علّم الحيوان أن الاقتراب من السجادة أو اليد يبدأ وينهي التعامل."},{"step":2,"title":"المس لفترة قصيرة","description":"المس منطقة واحدة لثانية ثم كافئ واترك الحيوان."},{"step":3,"title":"أضف الأداة","description":"اعرض الفرشاة أو الحقيبة بشكل منفصل قبل تكرار قصير."},{"step":4,"title":"ابنِ روتيناً للعيادة","description":"تدرب على الدخول والوزن والتقييد اللطيف مع الفريق البيطري عند الحاجة."}]',
  '["Use a non-slip surface","Never force a painful or inflamed area","Ask a veterinarian to demonstrate nail, ear, or dental handling"]',
  '["استخدم سطحاً غير قابل للانزلاق","لا تجبر الحيوان على منطقة مؤلمة أو ملتهبة","اطلب من الطبيب شرح التعامل مع الأظافر أو الأذن أو الأسنان"]',
  '["The pet can pause and resume handling","The pet enters the carrier or accepts a brief check with lower stress"]',
  '["قدرة الحيوان على التوقف واستئناف التعامل","دخول الحقيبة أو قبول الفحص القصير بتوتر أقل"]'
),
(
  'Recall and Emergency Stop',
  'العودة والتوقف في المواقف الحرجة',
  'behavioral_modification',
  'A safety-focused pathway for dogs that combines a reliable recall foundation with management, long-line work, and a practiced stop cue.',
  'مسار يركز على السلامة للكلاب ويجمع بين العودة الموثوقة وإدارة البيئة وحبل التدريب وإشارة التوقف المتدرب عليها.',
  'advanced', '6 months and older', 35,
  '[{"step":1,"title":"Choose high-value rewards","description":"Use rewards that are reserved for recall and safe outdoor work."},{"step":2,"title":"Practice at short distance","description":"Call once from a low-distraction environment and reward the return generously."},{"step":3,"title":"Add a long line","description":"Increase distance and distractions while keeping physical safety available."},{"step":4,"title":"Rehearse the stop cue","description":"Build a separate stop or hand-target behavior before using it near hazards."}]',
  '[{"step":1,"title":"اختر مكافآت عالية القيمة","description":"استخدم مكافآت مخصصة للعودة والعمل الخارجي الآمن."},{"step":2,"title":"تدرب من مسافة قصيرة","description":"نادِ مرة واحدة في بيئة قليلة المشتتات وكافئ العودة جيداً."},{"step":3,"title":"أضف حبل التدريب","description":"زد المسافة والمشتتات مع الحفاظ على الأمان الجسدي."},{"step":4,"title":"كرر إشارة التوقف","description":"ابنِ سلوك توقف أو لمس اليد بشكل منفصل قبل المواقف الخطرة."}]',
  '["Never test recall near traffic without physical management","Do not repeat the cue until the dog ignores it","Use a veterinarian or qualified behavior professional for fear or aggression cases"]',
  '["لا تختبر العودة قرب المرور دون وسيلة أمان","لا تكرر الإشارة حتى يتجاهلها الكلب","استعن بالطبيب أو مختص السلوك في حالات الخوف أو العدوان"]',
  '["The dog returns on the first cue in controlled settings","The dog can stop or target the hand on a long line"]',
  '["عودة الكلب من الإشارة الأولى في بيئة مضبوطة","قدرة الكلب على التوقف أو لمس اليد بحبل التدريب"]'
);

INSERT INTO bestPractices
  (title, titleAr, category, content, contentAr, keyPoints, keyPointsAr, species, source, `references`)
VALUES
(
  'Preventive visits and vaccination records',
  'الزيارات الوقائية وسجل التطعيمات',
  'health',
  'Preventive care is easier to manage when the owner keeps one current record of vaccinations, parasite control, weight, medications, and questions for the next visit. A schedule should be individualized to species, age, lifestyle, exposure, and local veterinary advice. Bring the record to every clinic visit and ask what is due next rather than relying on memory.',
  'تكون الرعاية الوقائية أسهل عندما يحتفظ صاحب الحيوان بسجل محدث للتطعيمات ومكافحة الطفيليات والوزن والأدوية والأسئلة للزيارة القادمة. يجب تخصيص الجدول حسب النوع والعمر ونمط الحياة والتعرض وتوصية الطبيب المحلي. اصطحب السجل إلى كل زيارة واسأل عما يحين موعده بدلاً من الاعتماد على الذاكرة.',
  '["Keep one dated health record","Ask the veterinarian to tailor the schedule","Bring medication and vaccination information to every visit"]',
  '["احتفظ بسجل مؤرخ واحد","اطلب من الطبيب تخصيص الجدول","أحضر معلومات الأدوية والتطعيمات لكل زيارة"]',
  '["cat","dog"]', 'Veterinary preventive-care guidance', '["https://www.avma.org/resources-tools/pet-owners/petcare"]'
),
(
  'Safe nutrition changes and portion control',
  'تغيير الغذاء بأمان وضبط الكمية',
  'nutrition',
  'Change diets gradually unless a veterinarian gives a different medical instruction. Measure portions, keep treats within the daily plan, and monitor body condition rather than relying on appetite alone. Sudden vomiting, diarrhea, refusal to eat, or pain after a diet change warrants veterinary advice.',
  'غيّر الغذاء تدريجياً ما لم يوجه الطبيب بخلاف ذلك لأسباب طبية. قس الكميات واحتسب المكافآت ضمن الخطة اليومية وراقب حالة الجسم بدلاً من الاعتماد على الشهية وحدها. القيء أو الإسهال المفاجئ أو رفض الطعام أو الألم بعد تغيير الغذاء يحتاج إلى استشارة بيطرية.',
  '["Measure the daily portion","Transition gradually when appropriate","Ask about medical diets before using supplements"]',
  '["قس الكمية اليومية","انتقل تدريجياً عند ملاءمة ذلك","اسأل عن الحميات الطبية قبل استخدام المكملات"]',
  '["cat","dog"]', 'Companion-animal nutrition guidance', '["https://www.aafco.org/consumers/understanding-pet-food/"]'
),
(
  'Emergency red flags require direct care',
  'علامات الطوارئ تحتاج إلى رعاية مباشرة',
  'emergency_care',
  'Seek urgent veterinary help for breathing difficulty, collapse, uncontrolled bleeding, repeated seizures, severe trauma, suspected poisoning, inability to urinate, or sudden severe weakness. Keep the pet quiet, avoid giving human medication, and call the clinic while arranging transport. Online guidance cannot safely replace an examination in these situations.',
  'اطلب مساعدة بيطرية عاجلة عند صعوبة التنفس أو الانهيار أو النزيف غير المتحكم فيه أو النوبات المتكررة أو الإصابة الشديدة أو الاشتباه في التسمم أو عدم القدرة على التبول أو الضعف الشديد المفاجئ. حافظ على هدوء الحيوان وتجنب أدوية البشر واتصل بالعيادة أثناء ترتيب النقل. الإرشاد عبر الإنترنت لا يغني عن الفحص في هذه الحالات.',
  '["Breathing difficulty is an emergency","Do not give human medication unless instructed","Call ahead and transport safely"]',
  '["صعوبة التنفس حالة طارئة","لا تعطِ دواءً بشرياً دون توجيه","اتصل مسبقاً وانقل الحيوان بأمان"]',
  '["cat","dog"]', 'Veterinary emergency-care guidance', '["https://www.avma.org/resources-tools/pet-owners/petcare"]'
),
(
  'Humane reward-based training',
  'التدريب الإنساني القائم على المكافأة',
  'training',
  'Reward-based training makes the desired behavior clear and helps preserve trust. Use short sessions, immediate feedback, and management to prevent rehearsal of unsafe behavior. Avoid punishment, intimidation, and tools that cause pain. Escalating fear, aggression, or distress should be assessed by a veterinarian or qualified behavior professional.',
  'يجعل التدريب القائم على المكافأة السلوك المطلوب واضحاً ويساعد على الحفاظ على الثقة. استخدم جلسات قصيرة وتعزيزاً فورياً وإدارة للبيئة لمنع تكرار السلوك غير الآمن. تجنب العقاب والتخويف والأدوات المؤلمة. يجب تقييم الخوف أو العدوان أو الضيق المتصاعد من الطبيب أو مختص سلوك مؤهل.',
  '["Reward the behavior you want","Manage the environment while teaching","Refer fear or aggression cases"]',
  '["كافئ السلوك المطلوب","أدر البيئة أثناء التعليم","أحل حالات الخوف أو العدوان إلى مختص"]',
  '["cat","dog"]', 'Animal-welfare behavior guidance', '["https://avsab.org/resources/position-statements/"]'
),
(
  'A clean, low-stress litter environment',
  'بيئة نظيفة وقليلة التوتر لصندوق الفضلات',
  'behavior',
  'Cats need predictable access to clean litter boxes in quiet locations. Provide enough boxes for the household, remove waste regularly, and avoid sudden changes in litter type or location. A new change in urination, straining, blood, or repeated box avoidance should be discussed urgently with a veterinarian.',
  'تحتاج القطط إلى وصول متوقع لصناديق فضلات نظيفة في أماكن هادئة. وفر عدداً مناسباً للصناديق ونظف الفضلات بانتظام وتجنب التغيير المفاجئ في نوع الرمل أو مكانه. يجب مناقشة التغير الجديد في التبول أو الحزق أو الدم أو تجنب الصندوق المتكرر مع الطبيب بشكل عاجل.',
  '["Keep boxes clean and quiet","Change litter gradually","Treat urinary changes as medical signals"]',
  '["حافظ على نظافة الصناديق وهدوئها","غيّر الرمل تدريجياً","اعتبر تغيرات التبول علامات طبية"]',
  '["cat"]', 'Feline environmental and welfare guidance', '["https://catvets.com/public/PDFs/AAFP_Environmental_Guidelines.pdf"]'
),
(
  'Daily skin, coat, and parasite checks',
  'الفحص اليومي للجلد والفرو والطفيليات',
  'grooming',
  'A brief routine check can help owners notice mats, wounds, parasites, odor, ear changes, or new lumps earlier. Handle gently and record what changes over time. Do not apply human creams, essential oils, or parasite products made for another species without veterinary advice.',
  'يساعد الفحص القصير المنتظم أصحاب الحيوانات على ملاحظة العقد والجروح والطفيليات والرائحة وتغيرات الأذن أو الكتل الجديدة مبكراً. تعامل بلطف وسجل التغيرات مع الوقت. لا تستخدم كريمات البشر أو الزيوت العطرية أو منتجات طفيليات مخصصة لنوع آخر دون استشارة الطبيب.',
  '["Check gently in good light","Record changes with dates","Use species-appropriate products only"]',
  '["افحص بلطف وفي إضاءة جيدة","سجل التغيرات مع التواريخ","استخدم منتجات مناسبة للنوع فقط"]',
  '["cat","dog"]', 'Veterinary dermatology and parasite-prevention guidance', '["https://www.esccap.org/guidelines/"]'
),
(
  'Enrichment should match the individual animal',
  'يجب أن يناسب الإثراء الحيوان نفسه',
  'enrichment',
  'Enrichment is most useful when it matches the animal’s species, age, mobility, preferences, and medical status. Offer choice across movement, scent, foraging, rest, and social contact, then watch for fatigue or frustration. Inspect toys and remove damaged pieces that could be swallowed.',
  'يكون الإثراء أكثر فائدة عندما يناسب نوع الحيوان وعمره وقدرته الحركية وتفضيلاته وحالته الطبية. قدم خيارات في الحركة والشم والبحث عن الطعام والراحة والتواصل الاجتماعي ثم راقب التعب أو الإحباط. افحص الألعاب وأزل القطع التالفة القابلة للابتلاع.',
  '["Offer choice, not forced interaction","Rotate safe activities","Inspect toys before use"]',
  '["قدم الاختيار ولا تجبر التفاعل","بدل الأنشطة الآمنة","افحص الألعاب قبل الاستخدام"]',
  '["cat","dog"]', 'Animal-welfare enrichment guidance', '["https://www.aaha.org/resources/" ]'
),
(
  'Prepare a useful veterinary handoff',
  'جهّز معلومات مفيدة للطبيب البيطري',
  'health',
  'Before a consultation, record when the problem started, what changed, appetite and water intake, elimination, medications, and any images or videos. Bring the exact product packaging when a supplement or possible toxin is involved. A concise timeline helps the veterinary team make safer decisions.',
  'قبل الاستشارة، سجل وقت بدء المشكلة وما تغير والشهية واستهلاك الماء والإخراج والأدوية وأي صور أو فيديوهات. أحضر عبوة المنتج نفسها عند وجود مكمل أو اشتباه في مادة سامة. يساعد التسلسل الزمني المختصر فريق الطب البيطري على اتخاذ قرارات أكثر أماناً.',
  '["Write a timeline","Bring medication and product packaging","Share videos when they show the behavior"]',
  '["اكتب تسلسلاً زمنياً","أحضر الأدوية وعبوات المنتجات","شارك الفيديو عندما يوضح السلوك"]',
  '["cat","dog"]', 'Veterinary communication guidance', '["https://www.avma.org/resources-tools/pet-owners/petcare"]'
);
