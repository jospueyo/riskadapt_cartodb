<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>RiskAdapT</title>
    <script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" /> <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw-src.css" /> <!-- Leaflet Draw CSS -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"> <!-- jQuery UI CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="assets/style.css"> <!-- Our own custom CSS document -->
  </head>
  <body>
    <?php
      $loginSuccessful=false;
      if(isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])){
        $userName = $_SERVER['PHP_AUTH_USER'];
        $password = $_SERVER['PHP_AUTH_PW'];
        if($userName == 'grmatig' && $password == 'aigua'){
          $loginSuccessful = true;
        }
      }

      if(!$loginSuccessful){
        header('WWW-Authenticate:Basic');
        header('HTTP/1.0 401 Unauthorized');
        echo "L'usuari o la contrassenya són incorrectes";
      }
    ?>

    <div class="container-fluid" id="div-content">
      <div id="map">
        <div class="layers">
          <button type="button" onclick="map_layer()" name="button" class="layer_button">Mapa</button>
          <button type="button" onclick="orto_layer()" name="button" class="layer_button">Orto</button>
        </div>
      </div>
      <br>
      <div class="buttons">
        <button type="button" onclick="startEdits()" name="button">Activa l'edició</button>
        <button type="button" onclick="stopEdits()" name="button">Atura l'edició</button>
      </div>
    </div>

    <div id="dialog" title="Entra les dades de l'element">
      <form>
        <fieldset>
          <div class="form-group">
            <label for="element">Nom de l'element</label><span class="asterisc">*</span>
            <input type="text" name="element" id="element" class="text ui-widget-content ui-corner-all form-control">
          </div>

          <div class="form-group">
            <label for="description">Descripció</label>
            <textarea name="description" id="description" cols="40" rows="5" class="text ui-widget-content ui-corner-all form-control"></textarea>
          </div>

          <div class="form-group">
            <label for="year">Any</label><span class="asterisc">*</span>
            <input type="number" name="year" id="year" class="text ui-widget-content ui-corner-all form-control">
          </div>

          <div class="form-group">
            <label for="type">Tipus d'element</label>
            <select name="type" id="type" class="text ui-widget-content ui-corner-all form-control">
              <option value="projecte">Projecte</option>
              <option value="esdeveniment">Esdeveniment</option>
            </select>
          </div>

          <div class="form-group">
            <label for="risk">Riscs associats<br><small>(prem la tecla Control per escollir-ne més d'un)</small></label>
            <select name="risk" id="risk" class="text ui-widget-content ui-corner-all form-control">
              <option value="inundacions">Inundacions</option>
              <option value="foc">Focs forestals</option>
              <option value="calor">Onades de calor</option>
              <option value="sequera">Sequeres</option>
            </select>
          </div>

          <div class="form-group">
            <label for="link">Enllaç</label>
            <input type="text" name="link" id="link" class="text ui-widget-content ui-corner-all form-control">
          </div>

          <div class="form-group">
            <label for="creat_per">Creat per</label><span class="asterisc">*</span>
            <input type="text" name="creat_per" id="creat_per" placeholder="Escriu el teu nom"
                    class="text ui-widget-content ui-corner-all form-control">
          </div>
          <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
        </fieldset>
      </form>
    </div>

    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script> <!-- Leaflet v0.7.3 JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"></script> <!-- Leaflet Draw JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script> <!-- jQuery v1.11.2 JS -->
    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script> <!-- jQueryUI v1.11.4 JS -->
    <script src="./map.js" charset="utf-8"></script>
  </body>
</html>
