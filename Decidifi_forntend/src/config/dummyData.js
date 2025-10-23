import { ICONS } from "../constants";

const INITIAL_DATA_SIMPLE = [
  {
    key: "1",
    category: "Teaching Style and Curriculum",
    criteria:
      "The preschool’s teaching methods and curriculum align with your educational values and your child's learning style.",
    weighting: 0,
  },
  {
    key: "2",
    category: "Social Interaction and Group Play",
    criteria:
      "The preschool provides opportunities for group play and social interaction with peers in a supportive environment.",
    weighting: 0,
  },
  {
    key: "3",
    category: "Staff Qualifications and Care",
    criteria:
      "The preschool teachers and staff are qualified, experienced, and provide a caring and nurturing environment for children.",
    weighting: 0,
  },
  {
    key: "4",
    category: "Classroom Size and Attention",
    criteria:
      "The preschool offers manageable class sizes that ensure individualized attention and support for your child.",
    weighting: 0,
  },
  {
    key: "5",
    category: "Learning Environment and Facilities",
    criteria:
      "The preschool’s physical environment, including classrooms and play areas, is safe, clean, and conducive to learning.",
    weighting: 0,
  },
  {
    key: "6",
    category: "Alignment with Family Values",
    criteria:
      "The preschool’s values, culture, and approach to education reflect your family’s beliefs and priorities.",
    weighting: 0,
  },
  {
    key: "7",
    category: "Location and Accessibility",
    criteria:
      "The preschool is conveniently located, making daily drop-off and pick-up logistically feasible.",
    weighting: 0,
  },
  {
    key: "8",
    category: "Cost and Financial Considerations",
    criteria:
      "The preschool’s tuition and associated costs fit within your family’s budget without undue financial strain.",
    weighting: 0,
  },
  {
    key: "9",
    category: "Parent Involvement and Communication",
    criteria:
      "The preschool encourages parent involvement and maintains clear and consistent communication with families.",
    weighting: 0,
  },
  {
    key: "10",
    category: "Focus on Emotional and Social Development",
    criteria:
      "The preschool places emphasis on nurturing emotional intelligence and social skills in addition to academics.",
    weighting: 0,
  },
  {
    key: "11",
    category: "Reputation and Reviews",
    criteria:
      "The preschool has a positive reputation, with strong reviews or recommendations from other parents and educators.",
    weighting: 0,
  },
  {
    key: "12",
    category: "Extracurricular Activities and Enrichment",
    criteria:
      "The preschool offers additional activities, such as art, music, or physical education, to enrich your child’s learning experience.",
    weighting: 0,
  },
];

const INITIAL_DATA_COMPLEX = [
  {
    key: "1",
    category: "Teaching Style and Curriculum",
    criteria:
      "The preschool’s teaching methods align with your child’s learning style, whether it’s play-based, structured, or a mix of both.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "2",
    category: "Teaching Style and Curriculum",
    criteria:
      "The curriculum covers both academic foundations and developmental milestones appropriate for your child’s age.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "3",
    category: "Teaching Style and Curriculum",
    criteria:
      "The balance between structured activities and free play meets your expectations for early education.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "4",
    category: "Social Interaction and Group Play",
    criteria:
      "The preschool promotes healthy peer interactions and offers plenty of group activities for social development.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "5",
    category: "Social Interaction and Group Play",
    criteria:
      "Your child will have regular opportunities to learn and play with other children, building social skills.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "6",
    category: "Social Interaction and Group Play",
    criteria:
      "The school fosters a positive environment for your child to form friendships and develop communication skills.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "7",
    category: "Staff Qualifications and Care",
    criteria:
      "The preschool staff are qualified and experienced in early childhood education, ensuring your child is in capable hands.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "8",
    category: "Staff Qualifications and Care",
    criteria:
      "Teachers and caregivers provide a nurturing and attentive environment that makes your child feel safe and supported.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "9",
    category: "Staff Qualifications and Care",
    criteria:
      "Staff-to-child ratios are low enough to ensure personalized attention for each child.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "10",
    category: "Classroom Size and Attention",
    criteria:
      "Class sizes are small enough to ensure your child receives adequate attention from teachers.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "11",
    category: "Classroom Size and Attention",
    criteria:
      "The student-to-teacher ratio allows for individualized learning and care.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "12",
    category: "Classroom Size and Attention",
    criteria:
      "The classroom environment is structured in a way that supports active learning and exploration.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "13",
    category: "Learning Environment and Facilities",
    criteria:
      "The preschool has clean, safe, and stimulating facilities that encourage creative learning and play.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "14",
    category: "Learning Environment and Facilities",
    criteria:
      "Indoor and outdoor spaces are well-maintained and conducive to a variety of activities.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "15",
    category: "Learning Environment and Facilities",
    criteria:
      "Safety measures, including secure entry and exits, are in place to ensure the well-being of the children.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "16",
    category: "Alignment with Family Values",
    criteria:
      "The preschool’s educational philosophy aligns with your family’s values and parenting approach.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "17",
    category: "Alignment with Family Values",
    criteria:
      "The cultural and moral framework of the preschool reflects your own beliefs, ensuring consistency between home and school.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "18",
    category: "Alignment with Family Values",
    criteria:
      "You feel comfortable with the topics and activities that will be introduced in the preschool.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "19",
    category: "Location and Accessibility",
    criteria:
      "The preschool is conveniently located near your home or workplace, making transportation easy.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "20",
    category: "Location and Accessibility",
    criteria: "Drop-off and pick-up times fit well with your daily schedule.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "21",
    category: "Location and Accessibility",
    criteria:
      "Accessibility for children with special needs or other considerations is available if necessary.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "22",
    category: "Cost and Financial Considerations",
    criteria:
      "The tuition and fees are within your family’s budget, with no hidden costs or financial surprises.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "23",
    category: "Cost and Financial Considerations",
    criteria:
      "The value of the education provided matches the tuition costs, ensuring you get a good return on your investment.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "24",
    category: "Cost and Financial Considerations",
    criteria:
      "There are payment plans, scholarships, or financial aid options available if needed.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "25",
    category: "Parent Involvement and Communication",
    criteria:
      "The preschool has an open-door policy for parent visits and values parent involvement in school activities.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "26",
    category: "Parent Involvement and Communication",
    criteria:
      "Communication between staff and parents is regular, clear, and responsive to your needs.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "27",
    category: "Parent Involvement and Communication",
    criteria:
      "The preschool offers updates on your child’s progress, including any concerns or achievements.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "28",
    category: "Focus on Emotional and Social Development",
    criteria:
      "The preschool emphasizes emotional intelligence, helping children manage emotions and interact positively with others.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "29",
    category: "Focus on Emotional and Social Development",
    criteria:
      "Social development is nurtured through group activities, cooperative play, and teacher-led discussions.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "30",
    category: "Focus on Emotional and Social Development",
    criteria:
      "Teachers are trained to support emotional well-being, fostering resilience and empathy in young children.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "31",
    category: "Reputation and Reviews",
    criteria:
      "The preschool has a strong reputation in the community, with positive feedback from parents and educators.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "32",
    category: "Reputation and Reviews",
    criteria:
      "Parents speak highly of the program, and the school has a track record of success in preparing children for kindergarten.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "33",
    category: "Reputation and Reviews",
    criteria:
      "You feel reassured by testimonials, recommendations, or reviews when evaluating the preschool.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "34",
    category: "Extracurricular Activities and Enrichment",
    criteria:
      "The preschool offers enrichment activities such as art, music, sports, or language programs.",
    weighting: 0,
    rowSpan: 3,
  },
  {
    key: "35",
    category: "Extracurricular Activities and Enrichment",
    criteria:
      "These extracurricular activities complement the core curriculum and provide a well-rounded experience.",
    weighting: 0,
    rowSpan: 0,
  },
  {
    key: "36",
    category: "Extracurricular Activities and Enrichment",
    criteria:
      "Extracurricular options are offered as part of the school day or as after-school activities, depending on your child’s interests.",
    weighting: 0,
    rowSpan: 0,
  },
];
const INITIAL_DATA_DECISION = [
  {
    key: "1",
    category: "Decision-Making Frequency",
    criteria:
      "If you frequently face important decisions in personal, professional, or life domains, a subscription offers ongoing value.",
    score: "yes",
  },
  {
    key: "2",
    category: "Importance of Decisions",
    criteria:
      "If the decisions you face have significant consequences, the structured approach of Decidifi can enhance your confidence.",
    score: "yes",
  },
  {
    key: "3",
    category: "Need for Structure",
    criteria:
      "If you benefit from a clear, repeatable decision-making framework, subscribing ensures consistent access to tools.",
    score: "yes",
  },
  {
    key: "4",
    category: "Time Constraints",
    criteria:
      "If your decisions often require quick yet informed resolutions, Decidifi’s scorecards save you time while ensuring quality.",
    score: "yes",
  },
  {
    key: "5",
    category: "Variety of Decisions",
    criteria:
      "If your decision-making spans multiple areas, such as career, health, or investments, Decidifi’s broad library provides tailored tools.",
    score: "yes",
  },
  {
    key: "6",
    category: "Group Collaboration",
    criteria:
      "If you make decisions collaboratively, the platform’s group decision tools ensure balanced, inclusive input.",
    score: "yes",
  },
  {
    key: "7",
    category: "Emphasis on Objectivity",
    criteria:
      "If you want to minimize biases and rely on data-driven criteria, Decidifi’s scorecards provide a structured approach.",
    score: "yes",
  },
  {
    key: "8",
    category: "Cost Effectiveness",
    criteria:
      "If the annual subscription cost aligns with the value of making confident, well-informed decisions, a subscription is a wise investment.",
    score: "yes",
  },
  {
    key: "9",
    category: "Trial Experience",
    criteria:
      "If the 48-hour free trial helped you experience the platform's benefits, subscribing ensures continued access to these tools.",
    score: "yes",
  },
  {
    key: "10",
    category: "Future Decision Needs",
    criteria:
      "If you anticipate needing support for future decisions, subscribing ensures ongoing availability of updated scorecards.",
    score: "yes",
  },
  {
    key: "11",
    category: "Preference for Comprehensive Tools",
    criteria:
      "If you value both quick-view and in-depth decision-making options, the subscription gives you full flexibility.",
    score: "yes",
  },
  {
    key: "12",
    category: "Commitment to Personal Growth",
    criteria:
      "If making better decisions aligns with your personal or professional development goals, Decidifi supports your journey.",
    score: "yes",
  },
];

const DECISION_CATEGORIES = [
  {
    title: "Personal Decisions",
    image: ICONS.PERSONAL,
    description:
      "Make thoughtful choices that impact your family, relationships, health, and where you call home. Click on a decision category to view the list of available scorecards in our library.",
    categories: [
      {
        title: "Family",
        description: "Tackle important family matters with confidence.",
        image: ICONS.PERSONAL_FAMILY,
        decisions: [
          "Decide on a general parenting philosophy",
          "Decide on a set of rules to guide a child's understanding of responsibility and ethics",
          "Decide which family values to promote and celebrate",
          "Decide which family goals to prioritize and pursue",
          "Choose an extracurricular activity for a child",
          "Choose a summer camp for a child",
          "Decide whether to have a child",
          "Decide whether to adopt or foster a child",
          "Decide which pet to get",
          "Decide which family traditions to continue or discontinue",
          "Decide which chores and responsibilities to assign to family members",
          "Decide how to assign shared child-rearing responsibilities",
          "Choose a long-term care option for a parent",
          "Decide on co-parenting arrangements after separation or divorce",
        ],
      },
      {
        title: "Relationships",
        description: "Weigh decisions about friendships and partnerships.",
        image: ICONS.PERSONAL_FRIENDS,
        decisions: [
          "Decide whether to start a relationship",
          "Decide whether to move in with a partner",
          "Decide whether to get married",
          "Decide which wedding venue to pick",
          "Decide which party venue to pick",
          "Decide who to be friends with",
          "Decide whether to end an unproductive relationship or friendship",
          "Decide whether to confront someone about a difficult issue",
          "Decide when to say no to a requested commitment",
          "Decide whether to pursue a long distance relationship",
          "Decide whether to co-sign or financially back someone",
          "Decide whether to reconcile with estranged family or friends",
          "Decide whether to attend couples counseling",
          "Decide which couples counselor to see",
        ],
      },
      {
        title: "Health & Wellness",
        description: "Make informed decisions about your well-being.",
        image: ICONS.PERSONAL_HEALTH,
        decisions: [
          "Decide which healthcare plan to choose",
          "Decide which nutritional plan or diet to follow",
          "Decide which exercise regimen or method to commit to",
          "Decide which gym to join",
          "Decide which personal trainer to hire",
          "Decide which dietician/nutritionist to hire",
          "Decide which hobby or passion to pursue",
          "Decide which sport to play",
          "Decide which golf or country club to join",
          "Decide which piece of home fitness equipment to buy",
          "Decide which athletic watch to buy",
          "Decide which meal delivery service to use",
          "Decide which health supplements to take",
          "Decide which holistic health approach to adopt (e.g., acupuncture, chiropractic)",
          "Decide which sports recovery method to try (e.g., cryotherapy, massage)",
          "Decide which healthy habit to incorporate into your daily routine",
          "Decide which meditation or mindfulness practice to adopt",
          "Decide which preventative health measures to implement (e.g., vaccinations, screenings)",
          "Decide which alternative health treatment to try (e.g., herbal remedies, naturopathy)",
          "Decide which detox or cleanse program to follow",
          "Decide which weight management strategy to pursue",
          "Decide which smoking cessation program to follow",
          "Decide which stretching routine to incorporate",
          "Decide which fitness tracker app or platform to use",
        ],
      },
      {
        title: "Geography",
        description: "Choose where to live, work, or travel.",
        image: ICONS.PERSONAL_GEOGRAPHY,
        decisions: [],
      },
    ],
  },
  {
    title: "Professional Decisions",
    image: ICONS.PROFESSIONAL,
    description:
      "Approach career and workplace decisions with clarity, from job moves to selecting advisors and educational paths.  Click on a decision category to view the list of available scorecards in our library.",
    categories: [
      {
        title: "Career",
        description: "Navigate job offers and career shifts.",
        image: ICONS.PROFESSIONAL_CAREER,
        decisions: [
          "Decide which field you want to specialize in",
          "Decide which industry you want to work in",
          "Decide which job to pursue",
          "Decide which career guidance coach to hire",
          "Decide which job offer to accept",
          "Decide to stay in your current role or seek a promotion",
          "Decide to stay in your current role or seek employment elsewhere",
          "Decide to go back to work after an extended break",
          "Decide to start a business",
          "Decide which business to start",
          "Decide to buy a business",
          "Decide which business to buy",
          "Decide whether to take a sabbatical",
          "Decide when to retire",
          "Decide to sell a business",
          "Decide who to sell a business to",
          "Decide to create a nonprofit",
          "Decide which nonprofit to start",
          "Decide to run for office",
          "Decide which office to run for",
          "Decide whether to start a side hustle",
          "Decide which side hustle to pursue",
          "Decide whether to be career-focused or family-focused",
          "Decide what your personal professional brand is",
          "Decide which work-related skills and experience to develop",
          "Decide which niche to become an expert in",
          "Decide whether to write a book",
          "Decide which book to write",
          "Decide whether to buy a franchise",
          "Decide which franchise to buy",
        ],
      },
      {
        title: "Work",
        description:
          "Make strategic decisions around team dynamics and projects.",
        image: ICONS.PROFESSIONAL_WORKSPACE,
        decisions: [
          "Decide whether to create a position to hire to",
          "Decide which job candidates to shortlist",
          "Decide which entry-level employee to hire",
          "Decide which supervisor-level employee to promote or hire",
          "Decide which manager-level employee to promote or hire",
          "Decide which director-level employee to promote or hire",
          "Decide which executive-level employee to promote or hire",
          "Decide whether an employee or contractor is underperforming",
          "Decide whether to terminate an employee or contractor",
          "Decide who to mentor",
          "Decide who to be mentored by",
          "Decide what work-life balance should look like for you",
          "Decide which peer advisory group to join",
          "Decide which industry or trade group or association to join",
          "Decide which industry conference or workshop to attend",
          "Decide which employee recognition and rewards program to introduce",
          "Decide which competitive advantages position you favorably in the marketplace",
          "Decide which strategic business partnerships or collaborations to pursue",
          "Decide which external consultant or expert to hire",
          "Decide which employee benefits program to select",
          "Decide which workplace wellness program to choose",
          "Decide which product or service opportunity to pursue",
          "Decide which product or service innovation to investigate",
          "Decide which software or automation tool to adopt",
          "Decide which team members to collaborate with on a work assignment or project",
          "Decide which tasks to delegate to others",
          "Decide which organization to merge with or acquire",
          "Decide whether to take a business risk",
          "Decide which scorecard criteria are important to you in tracking your business' operations",
          "Decide which workplace benefits to take advantage of",
          "Decide whether to work in-office, remotely, or a hybrid of both",
          "Decide who to build your professional network around",
          "Decide which project to prioritize",
          "Decide which marketing strategy to prioritize",
          "Decide whether to outsource a business function",
          "Decide who to outsource a business function to",
          "Decide which vendor to choose for a major contract",
          "Decide which freelance platform to use for hiring",
          "Decide which hiring platform to use",
          "Decide whether to join a co-working space",
          "Decide which shipping company to work with",
          "Decide whether to implement a flexible work schedule",
          "Decide which eCommerce platform to use",
        ],
      },
      {
        title: "Advisory",
        description: "Select the best experts, consultants, or mentors.",
        image: ICONS.PROFESSIONAL_ADVISORY,
        decisions: [
          "Decide which financial advisor to work with",
          "Decide which CPA to work with",
          "Decide which insurance broker to work with",
          "Decide which legal advisor to work with",
          "Decide which mental health specialist to consult",
          "Decide which medical doctor to consult",
          "Decide which estate planner to consult",
          "Decide which life coach to work with",
          "Decide which spiritual advisor to seek guidance from",
          "Decide whether to have cosmetic surgery",
          "Decide which cosmetic surgeon to choose",
          "Decide whether to take out a loan",
          "Decide which loan company or officer to work with",
          "Decide which financial institution to bank with",
          "Decide whether to hire a nanny",
          "Decide which nanny to hire",
          "Decide whether to create a will or estate plan",
          "Decide which cleaner to hire",
          "Decide which landscaper to hire",
          "Decide which domestic chore or household responsibility to outsource",
        ],
      },
      {
        title: "Education",
        description: "Choose schools, courses, or learning paths.",
        image: ICONS.PROFESSIONAL_EDUCATION,
        decisions: [
          "Decide between enrolling your children in school or homeschooling them",
          "Decide which homeschooling program to choose",
          "Decide which pre-school to attend",
          "Decide which elementary school to attend",
          "Decide which middle school to attend",
          "Decide which extra-curricular tutor to hire",
          "Decide which high school to attend",
          "Decide which trade or technical school to attend",
          "Decide whether to go straight from High School to work",
          "Decide whether to go to college",
          "Decide which college to attend",
          "Decide whether to attend community college for 2 years and then transfer to a 4-year college",
          "Decide which college major to choose",
          "Decide which college minor to choose",
          "Decide whether to join a fraternity or sorority",
          "Decide which fraternity or sorority to join",
          "Decide which college internship to pursue",
          "Decide whether to continue education after obtaining a degree",
          "Decide which advanced degree to pursue",
          "Decide which online course to take",
          "Decide which certification to pursue",
          "Decide which book to read for professional development",
          "Decide which seminar or workshop to attend for professional development",
          "Decide whether to enroll in a training program",
          "Decide which training program to enroll in",
        ],
      },
    ],
  },
  {
    title: "Life Decisions",
    image: ICONS.LIFE,
    description:
      "Approach career and workplace decisions with clarity, from job moves to selecting advisors and educational paths.  Click on a decision category to view the list of available scorecards in our library.",
    categories: [
      {
        title: "Community",
        description: "Decide how to give back and get involved.",
        image: ICONS.LIFE_COMMUNITY,
        decisions: [
          "Decide whether to pursue a spiritual path",
          "Decide which church to belong to",
          "Decide which temple to belong to",
          "Decide which mosque to belong to",
          "Decide which charity to donate to",
          "Decide which charitable organization to volunteer for",
          "Decide on a political affiliation",
          "Decide which politician to vote for",
          "Decide which local environmental initiative to engage in",
        ],
      },
      {
        title: "Real Estate",
        description:
          "Simplify decisions about buying, selling, or investing in property.",
        image: ICONS.LIFE_REAL_ESTATE,
        decisions: [
          "Decide to buy a house",
          "Decide to rent a house",
          "Decide to build a house",
          "Decide which single family residence to buy",
          "Decide which single family residence to rent",
          "Decide on single family residence design-build preferences",
          "Decide which townhouse or condominium to buy",
          "Decide which townhouse or condominium to rent",
          "Decide which commercial building to buy",
          "Decide which commercial building to rent",
          "Decide which second home or extended vacation property to buy",
          "Decide which second home or extended vacation property to rent",
          "Decide which short-term vacation property to rent",
          "Decide which investment property to buy",
          "Decide whether to go solar",
          "Decide which solar installation company to choose",
          "Decide whether to invest in home improvements or renovations",
          "Decide which home improvements to invest in",
          "Decide which home remodeling company to choose",
          "Decide which alternative living arrangement (i.e., tiny house, co-housing, etc.) to choose",
          "Decide whether to downsize your home",
          "Decide whether to refinance a mortgage",
        ],
      },
      {
        title: "Purchasing",
        description:
          "Make smarter buying decisions for personal or business needs.",
        image: ICONS.LIFE_PURCHASING,
        decisions: [
          "Decide whether to buy or lease a vehicle",
          "Decide whether to buy or lease a new or used car or truck",
          "Decide which new car or truck to buy",
          "Decide which new car or truck to lease",
          "Decide which used car or truck to buy",
          "Decide which used car or truck to lease",
          "Decide whether to buy or lease an electric car",
          "Decide which electric car to buy",
          "Decide which electric car to lease",
          "Decide which motorcycle to buy",
          "Decide which motorcycle to lease",
          "Decide which bicycle to buy",
          "Decide which boat to buy",
          "Decide which eBike to buy",
          "Decide which RV to buy",
          "Decide which desktop computer to buy",
          "Decide which laptop computer to buy",
          "Decide which pad to buy",
          "Decide which smartphone to buy",
          "Decide which smartwatch to buy",
          "Decide which TV to buy",
          "Decide which gaming console to buy",
          "Decide which home theater system to buy",
          "Decide which refrigerator/freezer to buy",
          "Decide which washer/dryer to buy",
          "Decide which bed/mattress to buy",
          "Decide which closet organization system to buy",
          "Decide which home security system to buy",
          "Decide which flooring to buy",
          "Decide which lighting system to buy",
          "Decide which furniture collection to buy",
          "Decide which designer brand to shop",
          "Decide which golf clubs to buy",
          "Decide which gift to buy",
          "Decide which credit card to use to maximize rewards and benefits",
          "Decide which technology gadget to invest in to improve productivity",
        ],
      },
      {
        title: "Miscellaneous",
        description:
          "Simplify decisions that don’t neatly fit into other categories.",
        image: ICONS.LIFE_MISCELLEANCEOUS,
        decisions: [
          "Decide which social media platform(s) to engage in",
          "Decide whether to keep personal possessions or throw away/donate them",
          "Decide whether to use a scorecard to make a decision",
          "Decide if a quick-view scorecard is sufficient to make a decision",
          "Decide if an in-depth scorecard is necessary to make a decision",
        ],
      },
    ],
  },
];

// const INITIAL_DATA = [
//   {
//     key: "1",
//     category: "Teaching Style and Curriculum",
//     criteria:
//       "The preschool’s teaching methods align with your child’s learning style, whether it’s play-based, structured, or a mix of both.",
//     weighting: 0,
//     rowSpan: 3,
//   },
//   {
//     key: "2",
//     category: "Teaching Style and Curriculum",
//     criteria:
//       "The curriculum covers both academic foundations and developmental milestones appropriate for your child’s age.",
//     weighting: 0,
//     rowSpan: 0,
//   },
//   {
//     key: "3",
//     category: "Teaching Style and Curriculum",
//     criteria:
//       "The balance between structured activities and free play meets your expectations for early education.",
//     weighting: 0,
//     rowSpan: 0,
//   },
//   {
//     key: "4",
//     category: "Social Interaction and Group Play",
//     criteria:
//       "The preschool’s teaching methods and curriculum align with your educational values and your child's learning style.",
//     weighting: 12,
//     rowSpan: 1,
//   },
// ];

const TOURS = {
  MAKE_A_DECISION_TOUR: [
    {
      selector: ".ant-collapse", // Selects the main collapse container
      content: "Ian will add copy here.",
    },
    {
      selector: ".collapse-header", // Selects headers for subcategories
      content: "Ian will add copy here.",
    },
    {
      selector: ".ant-input-search", // Selects the search input
      content: "Ian will add copy here.",
    },
  ],
  SCORECARD: [
    {
      selector: ".quick-view-card",
      content: "Ian will add copy here.",
    },
    {
      selector: ".in-depth-card",
      content: "Ian will add copy here.",
    },
  ],
  DECISION_MAKERS: [
    {
      selector: ".ant-btn-dashed",
      content: "Ian will add copy here.",
    },
    {
      selector: ".ant-input",
      content: "Ian will add copy here.",
    },
    {
      selector: ".ant-input-number",
      content: "Ian will add copy here.",
    },
    {
      selector: ".ant-btn-text",
      content: "Ian will add copy here.",
    },
  ],
};

const DEFAULT_DECISION_MAKERS = [
  {
    name: "Max",
    contribution: 100,
  },
];

const USERS = [
  {
    id: 1,
    name: "Aiden",
    email: "aiden@gmail.com",
    phone_no: "4739483248023",
    password: "4234343",
  },
];

const USERS_LIST = [
  {
    value: 1,
    label: "Aiden",
  },
  {
    value: 2,
    label: "Max",
  },
  {
    value: 3,
    label: "Harry",
  },
];

export {
  TOURS,
  INITIAL_DATA_SIMPLE,
  DECISION_CATEGORIES,
  INITIAL_DATA_COMPLEX,
  INITIAL_DATA_DECISION,
  DEFAULT_DECISION_MAKERS,
  USERS,
  USERS_LIST,
};
