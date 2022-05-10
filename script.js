const galleryController = new GalleryController();
const galleryList = [
    {full: "/img/800.png",thumb: "/img/150.png", tags: []},
    {full: "/img/800_2_food.png",thumb: "/img/150_2_food.png", tags: ['food']},
    {full: "/img/800.png", thumb: "/img/150.png", tags: []},
    {full: "/img/800_2.png", thumb: "/img/150_2.png", tags: []},
    {full: "/img/800_sport.png",thumb: "/img/150_sport.png", tags: ['sport']},
    {full: "/img/800_2.png",thumb: "/img/150_2.png", tags: []}
];



window.addEventListener('load', galleryController.add(galleryList));