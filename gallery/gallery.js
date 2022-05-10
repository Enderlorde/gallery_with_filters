class EventEmitter{
    #events = {};
    constructor(){
        this.#events 
    }

    on(event, listener){
        (this.#events[event] || (this.#events[event] = [])).push(listener);
        return this;
    }

    emit(event, args){
        (this.#events[event] || []).slice().forEach(listener => listener(args));
    }
}

class GalleryModel extends EventEmitter{
    #imagesList = [];

    constructor(imagesList = []){
        super();

        if (imagesList.length > 0){
            this.#imagesList = imagesList;
        }
    }

    addImagesList(imagesList){
        this.#imagesList = [...this.#imagesList, ...imagesList];
        this.emit('imagesListUpdated');
    }

    getImagesList(){
        return (this.#imagesList);
    }
}

class GalleryView extends EventEmitter{
    #galleryElement;
    #galleryModel;

    constructor(model){
        super();
        this.#galleryElement = document.querySelector(`#gallery`);

        if (!this.#galleryElement){
            return new Error(`Gallery element was not found`);
        };

        this.#galleryModel = model;
    }

    closePreview(){
        document.querySelector('#preview').remove();
    }

    openPreview(img){
        if (document.querySelector('#preview')){
            this.closePreview();
        }

        const previewOverlayElement = document.createElement('div');
        previewOverlayElement.id = 'preview';
        previewOverlayElement.className = 'preview__overlay';
        previewOverlayElement.addEventListener('click', (event) => {
            this.closePreview();
            event.stopPropagation();
        });

        const previewElement = document.createElement('div');
        previewElement.className = 'gallery__preview preview';

        const previewPicture = document.createElement('img');
        previewPicture.className = 'preview__picture';
        previewPicture.src = img;
        previewPicture.addEventListener('click', (event) => event.stopPropagation());

        const previewCloseButton = document.createElement('button');
        previewCloseButton.className = 'preview__close';
        previewCloseButton.innerText = 'X';
        previewCloseButton.addEventListener('click', () => {
            this.closePreview();
            event.stopPropagation();
        })

        previewElement.appendChild(previewPicture);
        previewElement.appendChild(previewCloseButton);
        previewOverlayElement.appendChild(previewElement);

        this.#galleryElement.appendChild(previewOverlayElement);
    }

    render(filter = 'all'){
        if (this.#galleryElement)
            this.#galleryElement.innerHTML = '';

        let imagesList = this.#galleryModel.getImagesList();

        const filters = ['all'];
        
        imagesList.forEach(item => {
            item.tags.forEach(tag => {
                    if (!filters.includes(tag)){
                        filters.push(tag);
                    }
                }
            )
        })

        if (filter !== 'all')
            imagesList = imagesList.filter((item) => item.tags.includes(filter));
        
        const galleryFiltersElement = document.createElement('div');
        galleryFiltersElement.className = 'gallery__filters filters';
        filters.forEach(item => {
            const galleryFiltersItem = document.createElement('button');
            galleryFiltersItem.className = 'filters__item'
            if (filter == item){
                galleryFiltersItem.classList.add('active');
            }
            galleryFiltersItem.innerText = item;
            galleryFiltersItem.addEventListener('click', (event) => {
                this.render(item);
                event.preventDefault();
                event.stopPropagation();
            });
            galleryFiltersElement.appendChild(galleryFiltersItem);
        });

        const galleryThumbsElement = document.createElement('ul');
        galleryThumbsElement.className = 'gallery__thumbs thumbs';

        imagesList.forEach(img => {
            const galleryThumbsItem = document.createElement('li');
            galleryThumbsItem.className = 'thumbs__item';

            const galleryFullPictureLink = document.createElement('a');
            galleryFullPictureLink.href = img.full;
            galleryFullPictureLink.addEventListener('click', (event) => event.preventDefault());

            const galleryThumbPicture = document.createElement('img');
            galleryThumbPicture.src = img.thumb;
            galleryThumbPicture.dataset.tags = img.tags.join(' ');
            galleryThumbPicture.addEventListener('click', (event) => {
                this.openPreview(img.full);
                event.stopPropagation();
                event.preventDefault();
            });

            galleryFullPictureLink.appendChild(galleryThumbPicture);
            galleryThumbsItem.appendChild(galleryFullPictureLink);
            galleryThumbsElement.appendChild(galleryThumbsItem);
        });

        this.#galleryElement.appendChild(galleryFiltersElement);
        this.#galleryElement.appendChild(galleryThumbsElement);
    }

    get(){
        if (!this.#galleryElement){
            return new Error(`Gallery element not founded`);
        };

        return this.#galleryElement;
    }
}

class GalleryController extends EventEmitter{
    #galleryView;
    #galleryModel;
    
    constructor(){
        super();
        
        this.#galleryModel = new GalleryModel();
        this.#galleryView = new GalleryView(this.#galleryModel);

        this.#galleryModel.on('imagesListUpdated',() => this.#galleryView.render());
    }

    add(imagesList){
        this.#galleryModel.addImagesList(imagesList);
    }
}

