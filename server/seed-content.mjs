import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'telstp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function seedContent() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting content seeding...\n');

    // ============================================
    // NATURAL ALTERNATIVES SEED DATA
    // ============================================
    console.log('📦 Seeding Natural Alternatives...');
    
    const naturalAlternativesData = [
      // Organic Food
      {
        name: 'Organic Chicken & Sweet Potato',
        nameAr: 'دجاج عضوي مع البطاطا الحلوة',
        category: 'organic_food',
        description: 'Premium organic dog food with free-range chicken and sweet potatoes',
        descriptionAr: 'طعام كلاب عضوي فاخر من الدجاج الحر والبطاطا الحلوة',
        benefits: JSON.stringify(['High protein', 'Grain-free', 'Digestible', 'Hypoallergenic']),
        benefitsAr: JSON.stringify(['بروتين عالي', 'خالي من الحبوب', 'سهل الهضم', 'غير مسبب للحساسية']),
        ingredients: 'Organic chicken, sweet potato, peas, carrots, fish oil, vitamins',
        ingredientsAr: 'دجاج عضوي، بطاطا حلوة، بازلاء، جزر، زيت السمك، فيتامينات',
        suitableFor: JSON.stringify(['Dogs', 'All ages']),
        price: 45.99,
        supplier: 'Organic Pet Co',
        supplierUrl: 'https://organicpetco.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Organic+Dog+Food',
        verified: true,
        certifications: JSON.stringify(['USDA Organic', 'Non-GMO', 'Cruelty-free']),
        rating: 4.8,
        reviewCount: 234
      },
      {
        name: 'Raw Frozen Cat Food - Chicken & Fish',
        nameAr: 'طعام قطط مجمد خام - دجاج وسمك',
        category: 'organic_food',
        description: 'Raw frozen cat food with chicken and fish for natural nutrition',
        descriptionAr: 'طعام قطط مجمد خام من الدجاج والسمك للتغذية الطبيعية',
        benefits: JSON.stringify(['Raw nutrition', 'High moisture', 'Natural enzymes', 'Improved digestion']),
        benefitsAr: JSON.stringify(['تغذية خام', 'رطوبة عالية', 'إنزيمات طبيعية', 'هضم محسّن']),
        ingredients: 'Chicken, fish, organs, bone, vegetables, taurine',
        ingredientsAr: 'دجاج، سمك، أعضاء، عظام، خضروات، تاورين',
        suitableFor: JSON.stringify(['Cats', 'All ages']),
        price: 52.99,
        supplier: 'Raw Pet Nutrition',
        supplierUrl: 'https://rawpetnutrition.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Raw+Cat+Food',
        verified: true,
        certifications: JSON.stringify(['AAFCO', 'Vet approved', 'Hormone-free']),
        rating: 4.9,
        reviewCount: 189
      },
      {
        name: 'Grain-Free Rabbit Food',
        nameAr: 'طعام أرانب خالي من الحبوب',
        category: 'organic_food',
        description: 'Natural grain-free rabbit food with timothy hay and vegetables',
        descriptionAr: 'طعام أرانب طبيعي خالي من الحبوب مع تيموثي هاي والخضروات',
        benefits: JSON.stringify(['Dental health', 'Natural fiber', 'Digestive support', 'Nutritionally balanced']),
        benefitsAr: JSON.stringify(['صحة الأسنان', 'ألياف طبيعية', 'دعم الهضم', 'متوازن غذائياً']),
        ingredients: 'Timothy hay, alfalfa, vegetables, herbs, minerals',
        ingredientsAr: 'تيموثي هاي، برسيم، خضروات، أعشاب، معادن',
        suitableFor: JSON.stringify(['Rabbits', 'All ages']),
        price: 28.99,
        supplier: 'Natural Herbivore',
        supplierUrl: 'https://naturalherbivore.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Rabbit+Food',
        verified: true,
        certifications: JSON.stringify(['Vet recommended', 'Pesticide-free']),
        rating: 4.7,
        reviewCount: 156
      },
      // Natural Treats
      {
        name: 'Organic Peanut Butter Dog Treats',
        nameAr: 'علاجات الكلاب بزبدة الفول السوداني العضوية',
        category: 'natural_treats',
        description: 'Homemade-style organic peanut butter treats for dogs',
        descriptionAr: 'علاجات زبدة الفول السوداني العضوية بأسلوب محلي الصنع للكلاب',
        benefits: JSON.stringify(['Protein-rich', 'Natural ingredients', 'Low sugar', 'Training treats']),
        benefitsAr: JSON.stringify(['غني بالبروتين', 'مكونات طبيعية', 'سكر منخفض', 'علاجات التدريب']),
        suitableFor: JSON.stringify(['Dogs', 'Adult']),
        price: 12.99,
        supplier: 'Paws Bakery',
        supplierUrl: 'https://pawsbakery.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Dog+Treats',
        verified: true,
        certifications: JSON.stringify(['Organic', 'Xylitol-free']),
        rating: 4.6,
        reviewCount: 312
      },
      {
        name: 'Freeze-Dried Salmon Treats for Cats',
        nameAr: 'علاجات السلمون المجفف بالتجميد للقطط',
        category: 'natural_treats',
        description: 'Pure freeze-dried salmon treats with no additives',
        descriptionAr: 'علاجات سلمون مجفف بالتجميد نقي بدون إضافات',
        benefits: JSON.stringify(['Omega-3 rich', 'High protein', 'No fillers', 'Dental benefits']),
        benefitsAr: JSON.stringify(['غني بـ أوميجا 3', 'بروتين عالي', 'بدون حشوات', 'فوائد الأسنان']),
        suitableFor: JSON.stringify(['Cats', 'All ages']),
        price: 18.99,
        supplier: 'Fish Delights',
        supplierUrl: 'https://fishdelights.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Salmon+Treats',
        verified: true,
        certifications: JSON.stringify(['Wild-caught', 'Sustainable']),
        rating: 4.8,
        reviewCount: 267
      },
      // Eco Supplies
      {
        name: 'Biodegradable Poop Bags',
        nameAr: 'أكياس براز قابلة للتحلل البيولوجي',
        category: 'eco_supplies',
        description: 'Eco-friendly biodegradable waste bags for dogs',
        descriptionAr: 'أكياس نفايات صديقة للبيئة قابلة للتحلل البيولوجي للكلاب',
        benefits: JSON.stringify(['Biodegradable', 'Eco-friendly', 'Leak-proof', 'Scented options']),
        benefitsAr: JSON.stringify(['قابل للتحلل', 'صديق للبيئة', 'مقاوم للتسرب', 'خيارات معطرة']),
        suitableFor: JSON.stringify(['Dogs', 'All sizes']),
        price: 8.99,
        supplier: 'Green Paws',
        supplierUrl: 'https://greenpaws.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Poop+Bags',
        verified: true,
        certifications: JSON.stringify(['Compostable', 'Plastic-free']),
        rating: 4.5,
        reviewCount: 445
      },
      {
        name: 'Sustainable Bamboo Cat Litter',
        nameAr: 'رمل القطط المستدام من الخيزران',
        category: 'eco_supplies',
        description: 'Eco-friendly bamboo cat litter that is biodegradable and flushable',
        descriptionAr: 'رمل قطط صديق للبيئة من الخيزران قابل للتحلل والتنظيف',
        benefits: JSON.stringify(['Biodegradable', 'Flushable', 'Low dust', 'Natural odor control']),
        benefitsAr: JSON.stringify(['قابل للتحلل', 'قابل للتنظيف', 'غبار منخفض', 'التحكم الطبيعي في الرائحة']),
        suitableFor: JSON.stringify(['Cats', 'All ages']),
        price: 15.99,
        supplier: 'Eco Litter Co',
        supplierUrl: 'https://ecolitterco.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Bamboo+Litter',
        verified: true,
        certifications: JSON.stringify(['Sustainable', 'Vegan']),
        rating: 4.4,
        reviewCount: 389
      },
      // Toys & Enrichment
      {
        name: 'Natural Rubber Dog Toy',
        nameAr: 'لعبة كلب من المطاط الطبيعي',
        category: 'toys_enrichment',
        description: 'Durable natural rubber toy for dogs with interactive features',
        descriptionAr: 'لعبة مطاط طبيعي متينة للكلاب مع ميزات تفاعلية',
        benefits: JSON.stringify(['Non-toxic', 'Durable', 'Interactive', 'Promotes play']),
        benefitsAr: JSON.stringify(['غير سام', 'متين', 'تفاعلي', 'يعزز اللعب']),
        suitableFor: JSON.stringify(['Dogs', 'All sizes']),
        price: 14.99,
        supplier: 'Paws Play',
        supplierUrl: 'https://pawsplay.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Dog+Toy',
        verified: true,
        certifications: JSON.stringify(['Non-toxic', 'BPA-free']),
        rating: 4.7,
        reviewCount: 523
      },
      {
        name: 'Interactive Puzzle Feeder for Cats',
        nameAr: 'موزع الطعام التفاعلي للقطط',
        category: 'toys_enrichment',
        description: 'Enrichment puzzle feeder that slows down eating and provides mental stimulation',
        descriptionAr: 'موزع طعام لغز للإثراء يبطئ الأكل ويوفر تحفيزاً عقلياً',
        benefits: JSON.stringify(['Mental enrichment', 'Slower eating', 'Prevents obesity', 'Interactive play']),
        benefitsAr: JSON.stringify(['إثراء عقلي', 'أكل أبطأ', 'يمنع السمنة', 'لعب تفاعلي']),
        suitableFor: JSON.stringify(['Cats', 'All ages']),
        price: 19.99,
        supplier: 'Cat Enrichment Plus',
        supplierUrl: 'https://catenrichmentplus.com',
        imageUrl: 'https://via.placeholder.com/300x300?text=Puzzle+Feeder',
        verified: true,
        certifications: JSON.stringify(['BPA-free', 'Dishwasher safe']),
        rating: 4.8,
        reviewCount: 401
      }
    ];

    for (const item of naturalAlternativesData) {
      await connection.query(
        `INSERT INTO naturalAlternatives 
        (name, nameAr, category, description, descriptionAr, benefits, benefitsAr, ingredients, ingredientsAr, suitableFor, price, supplier, supplierUrl, imageUrl, verified, certifications, rating, reviewCount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name, item.nameAr, item.category, item.description, item.descriptionAr,
          item.benefits, item.benefitsAr, item.ingredients || null, item.ingredientsAr || null,
          item.suitableFor, item.price, item.supplier, item.supplierUrl, item.imageUrl,
          item.verified, item.certifications, item.rating, item.reviewCount
        ]
      );
    }
    console.log(`✅ Seeded ${naturalAlternativesData.length} natural alternatives\n`);

    // ============================================
    // TRAINING PROGRAMS SEED DATA
    // ============================================
    console.log('🎓 Seeding Training Programs...');
    
    const trainingProgramsData = [
      {
        title: 'Bathroom Training Basics',
        titleAr: 'أساسيات تدريب الحمام',
        category: 'bathroom_training',
        difficulty: 'beginner',
        description: 'Complete guide to house training your puppy or adult dog',
        descriptionAr: 'دليل شامل لتدريب الحمام للجراء أو الكلاب البالغة',
        objectives: JSON.stringify(['Establish routine', 'Recognize signals', 'Reward success', 'Prevent accidents']),
        objectivesAr: JSON.stringify(['إنشاء روتين', 'التعرف على الإشارات', 'مكافأة النجاح', 'منع الحوادث']),
        duration: 30,
        steps: JSON.stringify([
          { step: 1, title: 'Establish Schedule', description: 'Take puppy out every 2-3 hours' },
          { step: 2, title: 'Choose Spot', description: 'Designate specific outdoor area' },
          { step: 3, title: 'Reward Success', description: 'Praise and treat immediately' },
          { step: 4, title: 'Prevent Accidents', description: 'Watch for signs and supervise' }
        ]),
        stepsAr: JSON.stringify([
          { step: 1, title: 'إنشاء جدول', description: 'أخرج الجرو كل 2-3 ساعات' },
          { step: 2, title: 'اختر المكان', description: 'حدد منطقة خارجية محددة' },
          { step: 3, title: 'مكافأة النجاح', description: 'امدح وعامل فوراً' },
          { step: 4, title: 'منع الحوادث', description: 'راقب الإشارات والإشراف' }
        ]),
        estimatedWeeks: 8,
        suitableFor: JSON.stringify(['Dogs', 'Puppies', 'Adults']),
        prerequisites: JSON.stringify(['None']),
        successMetrics: JSON.stringify(['No accidents for 2 weeks', 'Consistent outdoor elimination']),
        verified: true,
        createdBy: 'Expert Trainer',
        rating: 4.9,
        reviewCount: 567
      },
      {
        title: 'Basic Obedience: Sit, Stay, Come',
        titleAr: 'الطاعة الأساسية: اجلس، ابق، تعال',
        category: 'obedience',
        difficulty: 'beginner',
        description: 'Master the three fundamental commands for dog training',
        descriptionAr: 'إتقان الأوامر الثلاثة الأساسية لتدريب الكلاب',
        objectives: JSON.stringify(['Teach sit command', 'Teach stay command', 'Teach come command', 'Build foundation']),
        objectivesAr: JSON.stringify(['تعليم أمر اجلس', 'تعليم أمر ابق', 'تعليم أمر تعال', 'بناء الأساس']),
        duration: 21,
        steps: JSON.stringify([
          { step: 1, title: 'Sit Command', description: 'Use treat lure to teach sitting' },
          { step: 2, title: 'Stay Command', description: 'Gradually increase duration' },
          { step: 3, title: 'Come Command', description: 'Practice recall with rewards' },
          { step: 4, title: 'Combine Commands', description: 'Practice sequences' }
        ]),
        stepsAr: JSON.stringify([
          { step: 1, title: 'أمر اجلس', description: 'استخدم طعم لتعليم الجلوس' },
          { step: 2, title: 'أمر ابق', description: 'زيادة المدة تدريجياً' },
          { step: 3, title: 'أمر تعال', description: 'ممارسة الاستدعاء مع المكافآت' },
          { step: 4, title: 'دمج الأوامر', description: 'ممارسة التسلسلات' }
        ]),
        estimatedWeeks: 4,
        suitableFor: JSON.stringify(['Dogs', 'All ages']),
        prerequisites: JSON.stringify(['Bathroom Training']),
        successMetrics: JSON.stringify(['Responds to all 3 commands', '80% success rate']),
        verified: true,
        createdBy: 'Professional Trainer',
        rating: 4.8,
        reviewCount: 612
      },
      {
        title: 'Leash Training & Walking',
        titleAr: 'تدريب المقود والمشي',
        category: 'walking',
        difficulty: 'beginner',
        description: 'Learn proper leash techniques and enjoyable walking habits',
        descriptionAr: 'تعلم تقنيات المقود الصحيحة وعادات المشي الممتعة',
        objectives: JSON.stringify(['Loose leash walking', 'Prevent pulling', 'Build confidence', 'Safe walking']),
        objectivesAr: JSON.stringify(['المشي برقبة فضفاضة', 'منع الشد', 'بناء الثقة', 'المشي الآمن']),
        duration: 14,
        steps: JSON.stringify([
          { step: 1, title: 'Leash Introduction', description: 'Get puppy comfortable with leash' },
          { step: 2, title: 'Loose Leash', description: 'Teach not to pull' },
          { step: 3, title: 'Direction Changes', description: 'Practice turns and stops' },
          { step: 4, title: 'Outdoor Walking', description: 'Extend to longer walks' }
        ]),
        stepsAr: JSON.stringify([
          { step: 1, title: 'تقديم المقود', description: 'اجعل الجرو مرتاحاً للمقود' },
          { step: 2, title: 'مقود فضفاض', description: 'علم عدم الشد' },
          { step: 3, title: 'تغييرات الاتجاه', description: 'ممارسة الانعطافات والتوقفات' },
          { step: 4, title: 'المشي في الخارج', description: 'مد إلى مشي أطول' }
        ]),
        estimatedWeeks: 2,
        suitableFor: JSON.stringify(['Dogs', 'All ages']),
        prerequisites: JSON.stringify(['Basic commands']),
        successMetrics: JSON.stringify(['No pulling on leash', 'Calm walking behavior']),
        verified: true,
        createdBy: 'Certified Trainer',
        rating: 4.7,
        reviewCount: 489
      },
      {
        title: 'Play & Socialization Skills',
        titleAr: 'مهارات اللعب والتنشئة الاجتماعية',
        category: 'socialization',
        difficulty: 'beginner',
        description: 'Develop healthy play behavior and social skills with other dogs and people',
        descriptionAr: 'تطوير سلوك اللعب الصحي ومهارات اجتماعية مع الكلاب والناس الآخرين',
        objectives: JSON.stringify(['Appropriate play', 'Dog-to-dog interaction', 'Human interaction', 'Bite inhibition']),
        objectivesAr: JSON.stringify(['اللعب المناسب', 'التفاعل بين الكلاب', 'التفاعل البشري', 'كبح العض']),
        duration: 28,
        steps: JSON.stringify([
          { step: 1, title: 'Play Styles', description: 'Teach appropriate play behaviors' },
          { step: 2, title: 'Dog Meetings', description: 'Supervised dog-to-dog interactions' },
          { step: 3, title: 'People Skills', description: 'Positive human interactions' },
          { step: 4, title: 'Bite Inhibition', description: 'Teach soft mouth' }
        ]),
        stepsAr: JSON.stringify([
          { step: 1, title: 'أنماط اللعب', description: 'علم سلوكيات اللعب المناسبة' },
          { step: 2, title: 'لقاءات الكلاب', description: 'التفاعلات المراقبة بين الكلاب' },
          { step: 3, title: 'مهارات الناس', description: 'التفاعلات الإيجابية البشرية' },
          { step: 4, title: 'كبح العض', description: 'علم الفم الناعم' }
        ]),
        estimatedWeeks: 4,
        suitableFor: JSON.stringify(['Dogs', 'Puppies']),
        prerequisites: JSON.stringify(['Basic commands']),
        successMetrics: JSON.stringify(['Friendly with other dogs', 'Gentle with people']),
        verified: true,
        createdBy: 'Behavior Specialist',
        rating: 4.8,
        reviewCount: 534
      },
      {
        title: 'Advanced Tricks & Agility',
        titleAr: 'الحيل المتقدمة والرشاقة',
        category: 'tricks',
        difficulty: 'advanced',
        description: 'Learn advanced tricks and agility exercises for mental and physical stimulation',
        descriptionAr: 'تعلم الحيل المتقدمة وتمارين الرشاقة للتحفيز العقلي والجسدي',
        objectives: JSON.stringify(['Advanced tricks', 'Agility basics', 'Mental stimulation', 'Physical fitness']),
        objectivesAr: JSON.stringify(['حيل متقدمة', 'أساسيات الرشاقة', 'التحفيز العقلي', 'اللياقة البدنية']),
        duration: 56,
        steps: JSON.stringify([
          { step: 1, title: 'Trick Foundation', description: 'Build on basic commands' },
          { step: 2, title: 'Complex Tricks', description: 'Teach roll over, play dead, etc' },
          { step: 3, title: 'Agility Intro', description: 'Start with simple obstacles' },
          { step: 4, title: 'Advanced Agility', description: 'Progress to complex courses' }
        ]),
        stepsAr: JSON.stringify([
          { step: 1, title: 'أساس الحيل', description: 'البناء على الأوامر الأساسية' },
          { step: 2, title: 'حيل معقدة', description: 'علم الدوران والتظاهر بالموت وما إلى ذلك' },
          { step: 3, title: 'مقدمة الرشاقة', description: 'ابدأ بعقبات بسيطة' },
          { step: 4, title: 'رشاقة متقدمة', description: 'التقدم إلى مسارات معقدة' }
        ]),
        estimatedWeeks: 8,
        suitableFor: JSON.stringify(['Dogs', 'Adult', 'Healthy']),
        prerequisites: JSON.stringify(['Basic obedience', 'Play skills']),
        successMetrics: JSON.stringify(['Completes 5+ tricks', 'Navigates agility course']),
        verified: true,
        createdBy: 'Professional Trainer',
        rating: 4.9,
        reviewCount: 412
      }
    ];

    for (const program of trainingProgramsData) {
      await connection.query(
        `INSERT INTO trainingPrograms 
        (title, titleAr, category, difficulty, description, descriptionAr, objectives, objectivesAr, duration, steps, stepsAr, estimatedWeeks, suitableFor, prerequisites, successMetrics, verified, createdBy, rating, reviewCount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          program.title, program.titleAr, program.category, program.difficulty,
          program.description, program.descriptionAr, program.objectives, program.objectivesAr,
          program.duration, program.steps, program.stepsAr, program.estimatedWeeks,
          program.suitableFor, program.prerequisites, program.successMetrics,
          program.verified, program.createdBy, program.rating, program.reviewCount
        ]
      );
    }
    console.log(`✅ Seeded ${trainingProgramsData.length} training programs\n`);

    // ============================================
    // BEST PRACTICES SEED DATA
    // ============================================
    console.log('📚 Seeding Best Practices...');
    
    const bestPracticesData = [
      {
        title: 'AAFCO Nutrition Standards for Dogs',
        titleAr: 'معايير التغذية AAFCO للكلاب',
        category: 'nutrition',
        description: 'Complete guide to AAFCO nutritional standards for optimal dog health',
        descriptionAr: 'دليل شامل لمعايير التغذية AAFCO لصحة الكلب المثلى',
        content: 'Dogs require balanced nutrition with proper protein, fat, vitamins, and minerals. AAFCO standards ensure commercial pet foods meet minimum nutritional requirements...',
        contentAr: 'تحتاج الكلاب إلى تغذية متوازنة مع البروتين والدهون والفيتامينات والمعادن المناسبة. تضمن معايير AAFCO أن أغذية الحيوانات الأليفة التجارية تفي بالحد الأدنى من المتطلبات الغذائية...',
        keyPoints: JSON.stringify(['Protein: 18-25%', 'Fat: 5-15%', 'Fiber: <5%', 'Calcium/Phosphorus ratio: 1:1 to 2:1']),
        keyPointsAr: JSON.stringify(['البروتين: 18-25%', 'الدهون: 5-15%', 'الألياف: <5%', 'نسبة الكالسيوم/الفوسفور: 1:1 إلى 2:1']),
        source: 'AAFCO Official Guidelines',
        sourceUrl: 'https://www.aafco.org',
        expertReviewed: true,
        reviewer: 'Dr. Sarah Johnson, DVM',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Dogs']),
        difficulty: 'intermediate',
        rating: 4.9,
        reviewCount: 234
      },
      {
        title: 'Positive Reinforcement Training Methods',
        titleAr: 'طرق التدريب بالتعزيز الإيجابي',
        category: 'behavior',
        description: 'Evidence-based training methods using positive reinforcement for behavioral development',
        descriptionAr: 'طرق تدريب قائمة على الأدلة باستخدام التعزيز الإيجابي لتطور السلوك',
        content: 'Positive reinforcement is the most effective and humane training method. It involves rewarding desired behaviors to increase their frequency...',
        contentAr: 'التعزيز الإيجابي هو أكثر طرق التدريب فعالية وإنسانية. يتضمن مكافأة السلوكيات المرغوبة لزيادة تكرارها...',
        keyPoints: JSON.stringify(['Reward immediately', 'Use high-value treats', 'Consistency is key', 'Avoid punishment']),
        keyPointsAr: JSON.stringify(['مكافأة فوراً', 'استخدم الحلويات عالية القيمة', 'التسق مهم', 'تجنب العقاب']),
        source: 'International Association of Canine Professionals',
        sourceUrl: 'https://www.iacp.com',
        expertReviewed: true,
        reviewer: 'Dr. Patricia McConnell, PhD',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Dogs', 'Cats']),
        difficulty: 'beginner',
        rating: 4.8,
        reviewCount: 567
      },
      {
        title: 'Preventive Health Care Schedule',
        titleAr: 'جدول الرعاية الصحية الوقائية',
        category: 'health',
        description: 'Comprehensive preventive health care schedule for dogs and cats throughout their life',
        descriptionAr: 'جدول شامل للرعاية الصحية الوقائية للكلاب والقطط طوال حياتهم',
        content: 'Regular veterinary check-ups, vaccinations, and preventive treatments are essential for pet longevity and health...',
        contentAr: 'الفحوصات البيطرية المنتظمة والتطعيمات والعلاجات الوقائية ضرورية لطول عمر الحيوان الأليف وصحته...',
        keyPoints: JSON.stringify(['Puppies: Every 3-4 weeks until 16 weeks', 'Adults: Annually', 'Seniors: Twice yearly', 'Dental care: Monthly brushing']),
        keyPointsAr: JSON.stringify(['الجراء: كل 3-4 أسابيع حتى 16 أسبوع', 'البالغون: سنوياً', 'كبار السن: مرتين سنوياً', 'العناية بالأسنان: تنظيف شهري']),
        source: 'American Veterinary Medical Association',
        sourceUrl: 'https://www.avma.org',
        expertReviewed: true,
        reviewer: 'Dr. Michael Chen, DVM',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Dogs', 'Cats']),
        difficulty: 'beginner',
        rating: 4.7,
        reviewCount: 445
      },
      {
        title: 'Environmental Enrichment for Indoor Cats',
        titleAr: 'الإثراء البيئي للقطط الداخلية',
        category: 'enrichment',
        description: 'Creating stimulating environments for indoor cats to prevent behavioral problems',
        descriptionAr: 'إنشاء بيئات محفزة للقطط الداخلية لمنع المشاكل السلوكية',
        content: 'Indoor cats need mental and physical stimulation through environmental enrichment. This includes vertical spaces, interactive toys, and play sessions...',
        contentAr: 'تحتاج القطط الداخلية إلى تحفيز عقلي وجسدي من خلال الإثراء البيئي. يتضمن هذا المساحات الرأسية والألعاب التفاعلية وجلسات اللعب...',
        keyPoints: JSON.stringify(['Vertical spaces (cat trees)', 'Window perches', 'Interactive toys', 'Puzzle feeders', 'Regular play sessions']),
        keyPointsAr: JSON.stringify(['المساحات الرأسية (أشجار القطط)', 'مقاعد النوافذ', 'ألعاب تفاعلية', 'موزعات الألغاز', 'جلسات لعب منتظمة']),
        source: 'International Cat Care',
        sourceUrl: 'https://www.icatcare.org',
        expertReviewed: true,
        reviewer: 'Dr. Emma Thompson, DVM',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Cats']),
        difficulty: 'beginner',
        rating: 4.8,
        reviewCount: 389
      },
      {
        title: 'Dental Care Best Practices',
        titleAr: 'أفضل ممارسات العناية بالأسنان',
        category: 'health',
        description: 'Comprehensive guide to maintaining optimal dental health for pets',
        descriptionAr: 'دليل شامل للحفاظ على صحة الأسنان المثلى للحيوانات الأليفة',
        content: 'Dental disease is one of the most common health problems in pets. Regular brushing, professional cleanings, and proper diet are essential...',
        contentAr: 'أمراض الأسنان من أكثر المشاكل الصحية شيوعاً في الحيوانات الأليفة. التنظيف المنتظم والتنظيفات المهنية والنظام الغذائي المناسب ضروري...',
        keyPoints: JSON.stringify(['Daily brushing', 'Dental treats', 'Professional cleaning annually', 'Monitor for signs']),
        keyPointsAr: JSON.stringify(['تنظيف يومي', 'علاجات الأسنان', 'تنظيف احترافي سنوياً', 'مراقبة العلامات']),
        source: 'Veterinary Dental Society',
        sourceUrl: 'https://www.avds.org',
        expertReviewed: true,
        reviewer: 'Dr. Robert Martinez, DVM',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Dogs', 'Cats']),
        difficulty: 'beginner',
        rating: 4.9,
        reviewCount: 523
      },
      {
        title: 'Obesity Prevention & Management',
        titleAr: 'الوقاية من السمنة وإدارتها',
        category: 'health',
        description: 'Evidence-based strategies for preventing and managing pet obesity',
        descriptionAr: 'استراتيجيات قائمة على الأدلة لمنع وإدارة السمنة في الحيوانات الأليفة',
        content: 'Pet obesity is a growing epidemic affecting health and lifespan. Proper nutrition, portion control, and exercise are key factors...',
        contentAr: 'السمنة في الحيوانات الأليفة وباء متنام يؤثر على الصحة والعمر. التغذية السليمة والتحكم في الحصص والتمارين عوامل رئيسية...',
        keyPoints: JSON.stringify(['Measure portions', 'Use low-calorie treats', 'Regular exercise', 'Monitor weight monthly']),
        keyPointsAr: JSON.stringify(['قياس الحصص', 'استخدام الحلويات منخفضة السعرات', 'التمارين المنتظمة', 'مراقبة الوزن شهرياً']),
        source: 'Association for Pet Obesity Prevention',
        sourceUrl: 'https://www.petobesityprevention.org',
        expertReviewed: true,
        reviewer: 'Dr. Lisa Anderson, DVM',
        reviewDate: new Date(),
        applicableSpecies: JSON.stringify(['Dogs', 'Cats']),
        difficulty: 'intermediate',
        rating: 4.7,
        reviewCount: 412
      }
    ];

    for (const practice of bestPracticesData) {
      await connection.query(
        `INSERT INTO bestPractices 
        (title, titleAr, category, description, descriptionAr, content, contentAr, keyPoints, keyPointsAr, source, sourceUrl, expertReviewed, reviewer, reviewDate, applicableSpecies, difficulty, rating, reviewCount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          practice.title, practice.titleAr, practice.category, practice.description, practice.descriptionAr,
          practice.content, practice.contentAr, practice.keyPoints, practice.keyPointsAr,
          practice.source, practice.sourceUrl, practice.expertReviewed, practice.reviewer,
          practice.reviewDate, practice.applicableSpecies, practice.difficulty, practice.rating, practice.reviewCount
        ]
      );
    }
    console.log(`✅ Seeded ${bestPracticesData.length} best practices\n`);

    console.log('🎉 Content seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Natural Alternatives: ${naturalAlternativesData.length}`);
    console.log(`   - Training Programs: ${trainingProgramsData.length}`);
    console.log(`   - Best Practices: ${bestPracticesData.length}`);
    console.log(`   - Total: ${naturalAlternativesData.length + trainingProgramsData.length + bestPracticesData.length}`);

  } catch (error) {
    console.error('❌ Error seeding content:', error);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedContent();
