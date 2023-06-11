import { setCookie ,getCookie} from "./cookie";
export var headerMenu = function () {
    var menu = [];
    var columns = this.getColumns();
    for (let column of columns) {
        let icon = document.createElement("p");
        icon.classList.add("TblClms");
        icon.classList.add(column.isVisible() ? "TblClms-check-square" : "TblClms-square");
        let label = document.createElement("span");
        let title = document.createElement("span");
        title.textContent = " " + column.getDefinition().title;
        label.appendChild(icon);
        label.appendChild(title);
        menu.push({
            label: label,
            action: function (e) {
                e.stopPropagation();
                column.toggle();
                if (column.isVisible()) {
                    setCookie(column.getDefinition().title,true,100)
                    icon.classList.remove("TblClms-square");
                    icon.classList.add("TblClms-check-square");
                } else {
                    setCookie(column.getDefinition().title,false,100)
                    icon.classList.remove("TblClms-check-square");
                    icon.classList.add("TblClms-square");
                }
            }
        });
    }
    setTimeout( () =>
{
    document.querySelectorAll( 'div.tabulator-menu' ).forEach( ( node ) =>
    {
        const top = node.getBoundingClientRect().top;
        if ( top < 0 ) // Only align the menu with the top of the viewport when the menu is too long
        {
            node.style.top = 0;
            node.style.bottom = null;
        }
    } );
}, 0 );

    return menu;
};


export const handleGSC = (name) =>{
    var status = getCookie(name)
    if(status==''){
        return true
    }else{
        return JSON.parse(getCookie(name))
    }
}