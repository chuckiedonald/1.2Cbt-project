ClassicEditor.create( document.querySelector( '#qnt' ) )
.then( editor => {
        console.log( editor );
} )
.catch( error => {
        console.error( error );
} );