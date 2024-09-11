import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../public/img/benefit-one.jpeg";
import benefitTwoImg from "../public/img/benefit-two.jpeg";

const benefitOne = {
  title: "Interesting items in the museum",
  //desc: "You can use this space to highlight your first benefit or a feature of your product. It can also contain an image or Illustration like in the example along with some bullet points.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Location",
      desc: "The museum is located in the old Hacienda San Eloy built in the 19th century.",
      icon: <CursorArrowRaysIcon />,
    },
    {
      title: "Infrastructure Museum",
      desc: "The museum has exhibition rooms, reserves, a laboratory and soon a multimedia room and study room for internal and external researchers.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Collection",
      desc: "The collection is the result of archaeological research work carried out throughout the university campus.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Archaeological Assets",
      desc: "There is a total of 58,060 archaeological assets rescued from archaeological research and excavations carried out during the years 2014 to 2020.",
      icon: <FaceSmileIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Different ways to interact with history",
  desc: "A visit to the Yachay Museum offers an enriching educational experience,connecting visitors with local cultural heritage and stimulating creativity and imagination. Additionally, it promotes cultural tourism, contributing to the economic development of the region, and serves as a community meeting space for cultural learning and celebration.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile interaction application.",
      desc: "You can interact with the museum through applications.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Sections for each interest",
      desc: "Wide variety of collections that attract the interest of young and old.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    //{
     // title: "Dark & Light Mode",
      //desc: "Nextly comes with a zero-config light & dark mode. ",
     // icon: <SunIcon />,
    //},
  ],
};


export {benefitOne, benefitTwo};
