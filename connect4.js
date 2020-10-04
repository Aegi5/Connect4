class Connect4{
  constructor(selector){
    this.ROWS = 6;
    this.COLS = 7;
    this.selector = selector;
    this.createGrid();
    this.setupEventListener();
  }
//NB : his convention, prefix jQuery-obtained DOM obj by a $ chara

  createGrid(){
    const $board = $(this.selector);
    console.log($board);
    for(let row = 0; row < this.ROWS; row++){
      const $row = $('<div>')
        .addClass('row');
      for(let col = 0; col < this.COLS; col++){
        const $col = $('<div>')
          .addClass('col empty')
          .attr('data-col', col) //add attribute ? but why name it data-col and not call then cann later on with .data('col') ?
          .attr('data-row', row); //my guess would be that using data-* tell attr to use data method
        $row.append($col);
      }
      $board.append($row);
    }
    console.log($board.html());
  }

  setupEventListener() {
     const $board = $(this.selector);

     function findLastEmptyCell(col){
       const cells = $(`.col[data-col = ${col}]`);
       console.log(cells);
       for(let i = cells.length -1;i >=0; i--){
         const $cell = $(cells[i]);
         if($cell.hasClass('empty')){
           return $cell;
         }
       }
       return(cells);
     }

     $board.on('mouseenter', '.col.empty', function(){
       console.log(this);
       const col = $(this).data('col');
       const $lastEmptyCell = findLastEmptyCell(col);
       $lastEmptyCell.addClass('next-red');
     }); // .on = jQuery method where you pass event to listen to and a selector to listen to

     $board.on('mouseleave', '.col', function(){
       $('.col').removeClass('next-red');
     });
  }
}
