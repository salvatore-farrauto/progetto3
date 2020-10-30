
$(document).ready(function () {


    // Event listeners:  ADDED DYNAMICALLY
    // 1: Delete Post: 
    $(document).on('click', '.deletePost', function () {
        idParent = $(this).closest('.post').attr('id') // closest goes up in the parents.
        //console.log(idParent) // FUNZIONA!! è GIUSTO!!

        urlPost = "http://localhost:3000/posts/" + idParent

        $.ajax({
            url: urlPost,
            type: 'DELETE',
            success: function (result) {
                // Do something with the result
                console.log(result)
                // Hides the post!!!
                $('#' + idParent).css("display", "none")
            }
        });
    })


    // 2. Patch for public/ not public: toggle publicity.
    $(document).on('click', '.publicPost', function () {
        idParent = $(this).closest('.post').attr('id') // Funziona.
        urlPost = "http://localhost:3000/posts/" + idParent

        var val = $('#' + idParent).find(".public").text()  // Era da chiamare .publicBadge the class!
        console.log("inside the tag:", val) // OKK

        var publicValueToChange = true;

        if (val == "Public") { // If is public now, we will send false to the database!
            publicValueToChange = false
        }

        var dataToSend = { public: publicValueToChange }

        var isItPublicAfter = publicValueToChange ? "Public" : "Draft"

        $.ajax({
            type: 'PATCH',
            url: urlPost,
            data: dataToSend,
            success: function (what) {
                $('#' + idParent).find(".public").html(isItPublicAfter)
                alert("the publicity of the post has changed in:" + isItPublicAfter);
            }
        })
    })



    // 3: UPDATE POST







    // 4: INVISIBILITY OF THE COMMENTS
    $(document).on('click', '.invisibleCommentBtn', function () {
        idComment = $(this).closest('.singleComment').attr('data-idcomment') // Funziona.
        // qual è l'id del commento? Lo estrapolo dall'attributo data-idcomment
        invisibleComment = $(this).closest('.singleComment').attr('data-invisible')
        // E' invisibile il commento? Lo estrapolo dall'attributo data-invisible
        urlComment = "http://localhost:3000/comments/" + idComment
        // Funziona!:
        //console.log("urlComment:", urlComment)// Funziona!! Ritorna l'id del commento!
        //console.log("invisibleComment?:", invisibleComment)

        var willItBeInvisible = (invisibleComment == "true") ? false : true
        console.log(willItBeInvisible)
        var dataToSend = { invisible: willItBeInvisible }

        var that = $(this)

        $.ajax({
            type: 'PATCH',
            url: urlComment,
            data: dataToSend,
            success: function (what) {
                console.log("what?", what)
                that.closest('.singleComment').attr('data-invisible', willItBeInvisible.toString())
                that.siblings('.commentInvisible').html("invisibile? " + willItBeInvisible.toString())
            }
        })

    })



    //When loading the page:
    getAllPostsAndComments();


    function getAllPostsAndComments() {


        var posts;
        var comments;


        // 1. chiamata get ai posts
        // GETTING ALL POSTS 
        $.get({
            url: "http://localhost:3000/posts",
            async: false, // Executing asyncrhonously: waiting for posts
            success: function (data, textStat) {
                console.log("data is:", data)
                console.log("type of data is:", typeof (data)) // è un array di oggetti (posts)
                console.log("data[3] is:", data[3]) // è un oggetto js, post.

                posts = data;
                console.log("posts:", posts)

                //console.log("textStat:", textStat)
                //console.log("typeof textStat:", typeof (textStat))
            }

        })

        // How to make synchronous ajax calls: with a function returning a promise
        // The promise makes the ajax call and when it concluded it resolves()

        // 2. chiamata get ai comments. (sincrona)
        $.get({
            url: "http://localhost:3000/comments",
            async: false,  // Executing asyncrhonously: waiting for comments
            success: function (data, textStat) {
                console.log("data is:", data)
                console.log("type of data is:", typeof (data)) // è un array di oggetti (comments)
                console.log("data[3] is:", data[3]) // è un oggetto js, comment.

                comments = data;
                console.log("comments:", comments)

                //console.log("textStat:", textStat)
                //console.log("typeof textStat:", typeof (textStat))
            }
        })


        displayAllPosts(posts, comments)

        // 3. function displayAllPosts. Questa prende come input 1) la lista (ordinata) dei posts
        //   e 2) la lista dei commenti.  Poi distribuisce i commenti per un post, creandone
        //   una lista. E richiama la funziona createUIPost(post, idPost, listacommentidelpost) tante
        //   volte quanti sono i posts.
    }








    $('#savePostButton').click(function () {

        // 1. Cattura i valori
        var postTitle = $('#postTitle').val();
        console.log("postTitle changed:", postTitle);
        var subTitlePost = $('#postSubTitle').val();
        console.log("postSubtitle:", subTitlePost);
        var postBody = $('#postBody').val();
        console.log("postBody:", postBody);
        var postAuthor = $('#postAuthor').val();
        console.log("postAuthor:", postAuthor);
        var postFeatured = $('#featuredCheck').is(":checked");
        console.log("postFeatured:", postFeatured);
        var postPublic = $('#publicCheck').is(":checked");
        console.log("postPublic:", postPublic);






        var post = new Post(postTitle,
            subTitlePost,
            postBody,
            postPublic,
            postFeatured,
            false,
            postAuthor)

        console.log("post creato:", post)


        var data = {
            title: postTitle,
            subtitle: subTitlePost,
            body: postBody,
            author: postAuthor,
            featured: postFeatured,
            public: postPublic,
            archived: false,
        }
        console.log("data:", data)





        $.post({
            url: "http://localhost:3000/posts",
            data: data,
            //async: false,
            success: function (msgRitornato, textStatus) {
                console.log('msgRitornato:', msgRitornato);
                console.log('textStatus:', textStatus);
                console.log('msgRitornato._id:', msgRitornato._id); // è l'id del post!
                var idPost = msgRitornato._id;
                console.log("idPost:", idPost);
                console.log("type of idPost:", typeof (idPost)) // è una stringa

                createUIPost(post, idPost)
                // createUIPost
                // Ora devi creare il post con idPost (per i commenti)
                // Per crearlo scrivi una funzione da un'altra parte. 
                // Nota che non possiamo scrivere la funzione dopo il post (ovvero al di
                // fuori di success). Questo perchè dobbiamo aspettare che 
                // il la chiamata ajax, che è asincrona, abbia terminato e ritornato
                // il valore di idPost.

            }
        })

        closeModal();

    })



    // Creates the post with comments.
    function createUIPost(post, idPost, listComments) { // Passiamo un oggetto di tipo post
        // listComments deve essere la lista degli oggetti comments (mongodb) GIA' 
        // LELGATI AL POST. QUINDI questa funzione NON si preoccupa di smistare i commenti
        // Ai relativi posts, ma ci penserà un'altra funzione sopra.
        var title = post.title
        console.log("title:", title)
        var body = post.body
        console.log("body:", body)
        var subtitle = post.subtitle
        console.log("subtitle:", subtitle)
        var postPublic = post.public ? "Public" : "Draft";
        console.log("public:", postPublic);
        var featured = post.featured ? "Featured" : "Not Featured"
        console.log("featured:", featured)
        var archived = post.archived ? "Archived" : "Not Archived"
        console.log("archived:", archived)
        var author = post.author
        console.log("author:", author)

        var modelPost = $('#postModello').clone()
        console.log(modelPost)

        modelPost.attr("id", idPost) //"Da Aggiungere poi l'id giusto con la chiamata post"
        // Anche da togliere la classe featured se non è featured.

        modelPost.find(".title").html(title)
        modelPost.find(".subtitle").html(subtitle)
        modelPost.find(".archived").html(archived)
        modelPost.find(".featured").html(featured)
        modelPost.find(".public").html(postPublic)
        modelPost.find(".bodyPost").html(body)
        modelPost.find(".authorPost").html(author)




        // ---------------------
        // Ora per la parte dei commenti:
        //listComments;



        modelPost.find("#commentsContainerModel").html("")

        if (listComments) {
            for (let k = 0; k < listComments.length; k++) {
                var modelComment = $('#commentModel').clone()
                modelComment.attr('id', "")

                let comment = listComments[k] // This is an object 
                //console.log("commento:", comment)
                console.log("comment._id:", comment._id) // è una stringa
                modelComment.find(".commentAuthor").html(comment.commentUser)
                modelComment.find(".commentBody").html(comment.body)
                modelComment.find(".commentDate").html("data creazione:" + comment.Created_date)
                modelComment.find(".commentInvisible").html("Invisibile? " + comment.invisible) // Per l'inviisibilità
                modelComment.attr('data-idcomment', comment._id) // Aggiungo al commento un
                // attributo che mi dica l'id del commento (l'id in mongodb)
                modelComment.attr('data-invisible', comment.invisible) // Aggiungo al commento
                // un attributo che mi dica se è invisibile o meno nel database

                modelPost.find("#commentsContainerModel").prepend(modelComment)
                console.log("iteration nr k:", k)
            }
        }



        modelPost.find("#commentsContainerModel").attr('id', "")
        // The commentsContainerModel is a specific element that we take and will clone. 
        // We must change its id.


        $('#whereToAddPosts').prepend(modelPost)

    }



    function displayAllPosts(listPosts, listComments) {


        for (let k = 0; k < listPosts.length; k++) {
            var post = listPosts[k]; // This is an object. We have to convert it to
            // class object Post in order to pass it to the createUIPost

            var post = new Post(
                post.title,
                post.subtitle,
                post.body,
                post.public,
                post.featured,
                post.archived,
                post.author,
                post._id,
                post.Created_date
            )
            var commentsInherentToPost = displayAllCommentsRelatedToOnePost(post.id, listComments)


            createUIPost(post, post.id, commentsInherentToPost)

        }
    }




    function displayAllCommentsRelatedToOnePost(idPost, listComments) {
        // Select Comments related to post with id: idPost.
        // listComments is the whole list of ALL comments (returned by the ajax call).
        //
        // Returns a list of comments related to the post.
        let resultComments = [];
        for (let j = 0; j < listComments.length; j++) {
            if (listComments[j].belongingPostID == idPost) {
                resultComments.push(listComments[j])
            }
        }

        //console.log("test displayAllCommentsRelatedToOnePost:", resultComments)
        return resultComments
    }


    //Test displayAllCommentsRelatedToOnePost:
    //displayAllCommentsRelatedToOnePost("5f91eac441040eed197546ec", comments)
    // IT works!




    function closeModal() {
        $('#exampleModal').modal('hide')
    }


    // Function resetValueInModal // When clicking save post button.
    // Not complete
    function resetModal() {
        var postTitle = $('#postTitle').val("");
        console.log("postTitle changed:", postTitle);
        var subTitlePost = $('#postSubTitle').val("");
        console.log("postSubtitle:", subTitlePost);
        var postBody = $('#postBody').val("");
        console.log("postBody:", postBody);
        var postAuthor = $('#postAuthor').val("");
        console.log("postAuthor:", postAuthor);
        var postFeatured = $('#featuredCheck').is(":checked");
        console.log("postFeatured:", postFeatured);
        var postPublic = $('#publicCheck').is(":checked");
        console.log("postPublic:", postPublic);
    }
});