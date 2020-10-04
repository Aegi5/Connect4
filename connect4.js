class Connect4{
  constructor(selector){
    this.ROWS = 6;
    this.COLS = 7;
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function(){} //call back function
    this.createGrid();
    this.player = 'red';
    this.setupEventListener();

  }
//NB : his convention, prefix jQuery-obtained DOM obj by a $ chara

  createGrid(){
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = 'red';
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
  }

  setupEventListener() {
     const $board = $(this.selector);
     const that = this;

     function findLastEmptyCell(col){
       const cells = $(`.col[data-col = ${col}]`);
       for(let i = cells.length -1;i >=0; i--){
         const $cell = $(cells[i]);
         if($cell.hasClass('empty')){
           return $cell;
         }
       }
       return(cells);
     }

     $board.on('mouseenter', '.col.empty', function(){
       const col = $(this).data('col');
       const $lastEmptyCell = findLastEmptyCell(col);
       $lastEmptyCell.addClass(`next-${that.player}`);
     }); // .on = jQuery method where you pass event to listen to and a selector to listen to

     $board.on('mouseleave', '.col', function(){
       $('.col').removeClass(`next-${that.player}`);
     });

     $board.on('click', '.col.empty', function(){
       if(that.isGameOver) return;
       const col = $(this).data('col');
       const $lastEmptyCell = findLastEmptyCell(col);

       $lastEmptyCell.removeClass(`empty next-${that.player}` );
       $lastEmptyCell.addClass(that.player);
       //this is the event called 'this', rn we need the original this which point to the DOM element connect4 ? so added
       //a original field
       $lastEmptyCell.data('player', that.player);

       const winner = that.checkForWinner(
         $lastEmptyCell.data('row'),
         $lastEmptyCell.data('col'));
       if(winner){
         //do stuff
         alert(`Game overt ! Player ${that.player} has won`);
         that.isGameOver = true;
         $('.col.empty').removeClass('empty');
         return;
       }

       that.player = (that.player == 'red') ? 'blue': 'red';
       that.onPlayerMove();
       $(this).trigger('mouseenter');

     });
  }

  //row cow last placed
  checkForWinner(row, col){
    const that = this;

    function $getCell(i, j){
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction){
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i,j);
      while (i >= 0 &&
      i < that.ROWS &&
      j >= 0 &&
      j < that.COLS &&
      $next.data('player') === that.player){
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i,j);
      }
      return total;
    }

    function checkWin(directionA, directionB){
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB);
      if(total >= 4){
        return that.player;
      }
      else {
        return null;
      }
    }

    function checkVerticals(){
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});//direction
    }

    function checkHorizontals(){
      return checkWin({i: 0, j: -1}, {i: 0, j: 1});
    }

    function checkDiagonalBLtoTR(){
      return checkWin({i:-1, j: -1}, {i:1, j: 1});
    }
    function checkDiagonalBRtoTL(){
      return checkWin({i:1, j: -1}, {i:-1, j: 1});
    }

    return checkVerticals() || checkHorizontals() || checkDiagonalBLtoTR() || checkDiagonalBRtoTL();
  }

  restart(){
    this.createGrid();
    this.onPlayerMove();
  }



}
