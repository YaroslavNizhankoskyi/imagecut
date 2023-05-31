This Azure Function is designed to resize images for the thumbnails.

To deploy it to Azure, use one of the existing deployment,
methods like VS Code or GitHub.

Try deploying it normally. If you meet he exception like:
"Cannot find module ../build/Release/sharp-win32-ia32.node" read further.

This function uses "sharp" image resizing npm package which
as of now is faulted - during deployment Azure compiles
win64-x64 node build. But during runtime win32-ia32 node build 
is required (This depends on current target system).

To solve this, remove "sharp" from package.json before deployment.
Redeploy it.
Then proceed to Kudu (Advanced tools), and open Application File explorer. 
Navigate to "site\wwwroot" and install "sharp" manually specifying
the required system options.

For example "npm install --platform=win32 --arch=ia32 sharp".
 