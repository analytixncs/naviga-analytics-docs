# Naviga Analytics Docs



This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Assets in Docs

From what I can see in my testing, anything you store in the **docs** directory can be accessed either by using markdown syntax or html.  This means that you can create an images directory to store your images in and a videos directory to store videos in.  For downloadable files you will want to use the Static method of storage.

All files other than **Markdown** or **MDX** will be hashed and copied to the assets directory in the build folder.  The other file types (images, pdfs, etc) will be stored in files that Docusaurus deems appropriate.  We don't have to worry about where it stores the files as it will resolve that when building our HTML.

**Markdown**

The below will create a link to the pdf file

`[ebook.pdf](pdfs/ebook.pdf)`

> NOTE: If there is a space in the filename enclose in angle brackets! `<space in file.pdf>`

**HTML**

`<a  target="_blank"  href={require('./pdfs/ebook.pdf').default}>  Download this PDF in pdf folder</a>`

> NOTE: Any files in the assets folders will be copied to the assets folder once build and **hashed** and stored in a folder appropriate to its type.  This means that the filename will be different than what you referenced in your markdown (usually with a hash code appended to the name).  For images, this is fine, but you may not want this for downloadable files.
> For files you do not want hashed, you will use the **Static** method of storing and accessing the files.



### Images

There is an `informer` directory in the `docs` folder.  You will create an images directory IN the informer directory:

`docs/informer/images`

To access these within your markdown files use following:
`![api_docs_001](images\image-file.png)`

### Video Files

You should copy your video files into the `docs/assets/` folder also.

```html
<div>
  <video width="800px" controls>
  <source src={require('./assets/video=file-name.mp4').default}/>
</video>
</div>
```

### Static or Downloadable Files

For all files OTHER than images, you will create folders in the `static` directory that is at the root of your Docusaurus project.

To access these files you will use the following syntax in your Markdown files:

`<a  target="_blank"  href="/folder-name-in-static-dir/downloadtest.zip">  Download this Zip</a>`

I have found that if you try and create a download link using **Markdown** syntax, docusaurus will hash the file and copy it to the `assets `directory once built.

`[download tgz](./folder-name-in-static-dir/job-status.tgz)` ❌ Not recommended.

