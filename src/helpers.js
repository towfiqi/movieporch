
export function boxoffice_time(index){
    var d = new Date();
    var Y = d.getFullYear();
    var M = d.getMonth() + 1;
    var D = d.getDate();

    if(index === 'start'){
        var M = M - 1;
    }

    return `${Y}-${M}-${D}`;

}

export function get_genre_name(id){
    if(id ===28){ return 'Action'};
    if(id ===12){ return 'Adventure'};
    if(id ===16){ return 'Animation'};
    if(id ===35){ return 'Comedy'};
    if(id ===80){ return 'Crime'};
    if(id ===99){ return 'Documentary'};
    if(id ===18){ return 'Drama'};
    if(id ===10751){ return 'Family'};
    if(id ===14){ return 'Fantasy'};
    if(id ===36){ return 'History'};
    if(id ===27){ return 'Horror'};
    if(id ===10402){ return 'Music'};
    if(id ===9648){ return 'Mystery'};
    if(id ===10749){ return 'Romance'};
    if(id ===878){ return 'Science Fiction'};
    if(id ===10770){ return 'TV Movie'};
    if(id ===53){ return 'Thriller'};
    if(id ===10752){ return 'War'};
    if(id ===37){ return 'Western'};
}

export function truncString(str, max, add){
    add = add || '';
    return (typeof str === 'string' && str.length > max ? str.substring(0,max)+add : str);
 };

 export function getMonth(index){
    let month = [];
    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "Jun";
    month[7] = "Jul";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";

    return month[index];
 }

 export function formatDate(date, showMonth){
    var d = new Date(date);
    var Y = d.getFullYear();
    var M = d.getMonth() + 1;
    var D = d.getDate();
    M = showMonth === true ? getMonth(M) : M ;

    return `${D} ${M} ${Y}`;
 }

 export function TopscrollTo() {
    if(window.scrollY!=0){
        setTimeout(function() {
           window.scrollTo(0,window.scrollY-30);
            TopscrollTo();
        }, 5);
    }
}

export function chunk(arr, chunkSize) {
    var R = [];
    for (var i=0,len=arr.length; i<len; i+=chunkSize)
      R.push(arr.slice(i,i+chunkSize));
    return R;
}

export function uploadImage (file, callback) {
    
    // Ensure it's an image
    if(file.type.match(/image.*/)) {
        console.log('An image has been loaded');

        // Load the image
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

                // Resize the image
                var canvas = document.createElement('canvas'),
                    max_size = 160,// TODO : pull max size from a site config
                    width = image.width,
                    height = image.height;
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg');
                console.log(dataUrl);
                
                callback(dataUrl);


            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
        
    }
            
}