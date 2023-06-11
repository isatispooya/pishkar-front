
import packageJson from '../../package.json';

export const caching= ()=> {
let version = localStorage.getItem('version');
    if(version!=packageJson.version)
    {
        if('caches' in window){
         caches.keys().then((names) => {
        names.forEach(name => {
            caches.delete(name);
        })
    });

    window.location.reload(true);
}

      localStorage.clear();
      localStorage.setItem('version',packageJson.version);
    }
};