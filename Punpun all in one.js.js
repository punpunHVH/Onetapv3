//By PunPun

//7/10/2021

//Fake Lag Spammer

var next_tick_should_fakelag = true
function fire(){
    var ent = Entity.GetEntityFromUserID(Event.GetInt("userid"))
    if(ent != Entity.GetLocalPlayer())
        return
    next_tick_should_fakelag = false
}
function cM(){
    UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", true)
    if(!next_tick_should_fakelag)
    {
        UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", false)
        next_tick_should_fakelag = true
    }
}
Cheat.RegisterCallback("CreateMove", "cM")
Cheat.RegisterCallback("weapon_fire", "fire")

//Double tap

UI.AddSliderInt("PunPun DT", 0, 3);

function can_shift_shot(ticks_to_shift) {
    var me = Entity.GetLocalPlayer();
    var wpn = Entity.GetWeapon(me);

    if (me == null || wpn == null)
        return false;

    var tickbase = Entity.GetProp(me, "CCSPlayer", "m_nTickBase");
    var curtime = Globals.TickInterval() * (tickbase-ticks_to_shift)

    if (curtime < Entity.GetProp(me, "CCSPlayer", "m_flNextAttack"))
        return false;

    if (curtime < Entity.GetProp(wpn, "CBaseCombatWeapon", "m_flNextPrimaryAttack"))
        return false;

    return true;
}

function _TBC_CREATE_MOVE() {
    var is_charged = Exploit.GetCharge()
    var reserve = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "PunPun DT")

    Exploit[(is_charged != 1 ? "Enable" : "Disable") + "Recharge"]()

    if (can_shift_shot(14) && is_charged != 1) {
        Exploit.DisableRecharge();
        Exploit.Recharge()
    }

    Exploit.OverrideTolerance(reserve);
    Exploit.OverrideShift(14-reserve);
}

function _TBC_UNLOAD() {
    Exploit.EnableRecharge();
}

Cheat.RegisterCallback("CreateMove", "_TBC_CREATE_MOVE");
Cheat.RegisterCallback("Unload", "_TBC_UNLOAD");

//DDOs

//better by pun

UI.AddCheckbox("Teleport on peek");
UI.AddHotkey("ddos switch");
UI.AddSliderInt("amount of genders", 2, 2);
UI.AddSliderFloat("Lucky is a pedo", 8, 8);
UI.AddSliderInt("Better age of consent", 12, 12);
UI.AddCheckbox("Femboy mode");
UI.AddCheckbox("Homosexual mode");
UI.AddCheckbox("Free sex");
//Pun Pun Seggs
/**
 * @title Vector
 * @description Simple 3d vector system
 *
 * @typedef Vector {x: number, y: number, z: number}
 */
var vector = {
    _class: 'vector'
};
/**
 * @brief Creates a new 3d vector instance.
 * @param data {array}
 * @returns {Vector}
 */
vector.new = function(data)
{
    return {
        x: data[0],
        y: data[1],
        z: data[2]
    };
};
/**
 * @brief Realizes a mathematical operation between two vectors.
 * @param vec {Vector}
 * @param vec2 {Vector}
 * @param operation {string}
 * @returns {Vector}
 */
vector.operate = function(vec, vec2, operation)
{
  switch (operation)
  {
      case '+':
          return {
              x: vec.x + vec2.x,
              y: vec.y + vec2.y,
              z: vec.z + vec2.z
          };
      case '-':
          return {
              x: vec.x - vec2.x,
              y: vec.y - vec2.y,
              z: vec.z - vec2.z
          };
      case '*':
          return {
              x: vec.x * vec2.x,
              y: vec.y * vec2.y,
              z: vec.z * vec2.z
          };
      case 'x': //multiplication by number
          return {
              x: vec.x * vec2,
              y: vec.y * vec2,
              z: vec.z * vec2
          };
      case '/':
          return {
              x: vec.x / vec2.x,
              y: vec.y / vec2.y,
              z: vec.z / vec2.z
          };
      default:
          throw new Error("[Vector] Invalid operation type.");
  }
}; 
vector.to_array = function(vec)
{
    return [
        vec.x,
        vec.y,
        vec.z
    ];
};
//end of april's vector stuff
function extrapolate_tick(headpos, velocity, tick_amt)
{
    return vector.operate(headpos, vector.operate(velocity, tick_amt * Globals.TickInterval(), 'x'), "+"); //:flushed:
}
var has_teleported = false; //global variables are a great evil
var should_teleport = false;
var last_teleport_time = 0.0;
var js_items = ["Misc", "JAVASCRIPT", "Script Items"];
function on_move()
{
    if(UI.GetValue(js_items, "ddos punpun") && UI.IsHotkeyActive(js_items, "ddos switch"))
    {
        var is_dt_enabled = UI.IsHotkeyActive("Rage", "Exploits", "Doubletap");
        var teleport_cooldown = UI.GetValue(js_items, "Lucky is a pedo");
        if(Globals.Curtime() > last_teleport_time + teleport_cooldown)
        {
            if(is_dt_enabled && Exploit.GetCharge() < 0.95) //no point attempting to teleport if charge is too little
            {
                return;
            }
            if(should_teleport && !has_teleported)
            {
                if(is_dt_enabled)
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap");
                    last_teleport_time = Globals.Curtime();
                    should_teleport = false;
                    has_teleported = true;
                    return;
                }
                else
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap");
                    return;
                }
            }
            var local = Entity.GetLocalPlayer();
            var local_eyepos = Entity.GetEyePosition(local);
            var local_eyepos_vector = vector.new(local_eyepos);
            var local_velocity = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]");
            var local_velocity_vector = vector.new(local_velocity);
            var extrapolated_headpos = extrapolate_tick(local_eyepos_vector, local_velocity_vector, UI.GetValue(js_items, "amount of genders"));
            var enemies = Entity.GetEnemies();
            var teleport_mindamage = UI.GetValue(js_items, "Better age of consent");
            if(!should_teleport && !has_teleported)
            {
                for(var i = 0; i < enemies.length; i++)
                {
                    if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
                    {
                        var enemy_headpos = Entity.GetHitboxPosition(enemies[i], 0);
                        var enemy_pelvispos = Entity.GetHitboxPosition(enemies[i], 2); 
                        var trace = Trace.Bullet(local, enemies[i], vector.to_array(extrapolated_headpos), enemy_pelvispos);
                        var trace2 = Trace.Bullet(local, enemies[i], vector.to_array(extrapolated_headpos), enemy_headpos);
                        if(trace[1] > teleport_mindamage || trace2[1] > teleport_mindamage)
                        {
                            should_teleport = true;
                            break;
                        }
                    }
                }
            }
        }
        else if(has_teleported)
        {
            var should_attempt_to_reenable_dt = UI.GetValue(js_items, "Femboy mode");
            var should_attempt_to_recharge = UI.GetValue(js_items, "Homosexual mode");
            if(should_attempt_to_reenable_dt)
            {
                if(!is_dt_enabled)
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap"); 
                }
                if(should_attempt_to_recharge)
                {
                     Exploit.Recharge(); 
                }
            }
             has_teleported = false;
        }
    }
}
function update_menu()
{
    var is_script_enabled = UI.GetValue(js_items, "ddos punpun");
    UI.SetEnabled(js_items, "ddos switch", is_script_enabled);
    UI.SetEnabled(js_items, "amount of genders", is_script_enabled);
    UI.SetEnabled(js_items, "Lucky is a pedo", is_script_enabled);
    UI.SetEnabled(js_items, "Better age of consent", is_script_enabled);
    UI.SetEnabled(js_items, "Femboy mode", is_script_enabled);
    var is_dt_shit_enabled = UI.GetValue(js_items, "Femboy mode");
    UI.SetEnabled(js_items, "Homosexual mode", is_script_enabled && is_dt_shit_enabled);
    UI.SetEnabled(js_items, "Free sex", is_script_enabled);
}
function indicator()
{
    if(UI.GetValue(js_items, "ddos punpun") && UI.GetValue(js_items, "Free sex") && UI.IsHotkeyActive(js_items, "ddos switch"))
    {
        if(World.GetServerString() == "")
        {
            return;
        }
        if(!Entity.IsAlive(Entity.GetLocalPlayer()))
        {
            return;
        }
        var screen_size = Render.GetScreenSize();
        var teleport_cooldown = UI.GetValue(js_items, "Lucky is a pedo");
        Render.String(30, screen_size[1] * 0.8, 1, "TP", (Globals.Curtime() > last_teleport_time + teleport_cooldown) ? [25, 255, 25, 200] : [255, 25, 25, 200], 4);
    }   
}
function reset_shit() //sometimes the script fails after restarting a game
{
    has_teleported = false;
    should_teleport = false;
    last_teleport_time = 0.0;
}
Cheat.RegisterCallback("Draw", "update_menu");
Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("round_start", "reset_shit");
Cheat.RegisterCallback("Draw", "indicator");

//AA 

UI.AddCheckbox("Gay delta");
UI.AddDropdown( "Gay delta type", [ "Custom", "On key" ] );
const Gaydelta_modes = UI.AddMultiDropdown("Gay delta modes", [ "SGay walk", "Gay HP", "Standing" ]);
UI.AddHotkey("Gay delta on key");

function SetEnabled()
{
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta"))
    {
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta type", 1)
    }
    else
    {
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta type", 0)
    }

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 0 && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta"))
    {
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta modes", 1)
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta on key", 0)
    }
    else if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 1 && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta"))
    {
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta modes", 0)
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta on key", 1)
    }
    else
    {
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta modes", 0)
       UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Gay delta on key", 0)
    }
}

function get_velocity(index)
{
    var velocity = Entity.GetProp(index, "CBasePlayer", "m_vecVelocity[0]");
    return Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1]);
}

function get_health(index)
{
    health_override = Entity.GetProp(index, "CBasePlayer", "m_iHealth");
    return health_override;
}

function Gay_delta()
{
    localplayer_index = Entity.GetLocalPlayer( );
    const Gaydelta_dropdown_value = UI.GetValue.apply(null, Gaydelta_modes);
 
    var velocity = get_velocity(localplayer_index)
    var health = get_health(localplayer_index)
    var GayHP = false
    var SGayWalk = false
    var Standing = false
    var Onkey = false

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta") && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 0)
    {
       if (Gaydelta_dropdown_value & (1 << 0) && UI.IsHotkeyActive("Anti-Aim", "Extra", "SGay walk"))
       SGayWalk = true
       else
       SGayWalk = false

       if (Gaydelta_dropdown_value & (1 << 1) && health < 50)
       GayHP = true
       else
       GayHP = false

       if (Gaydelta_dropdown_value & (1 << 2) && velocity < 3)
       Standing = true
       else
       Standing = false
    }
    else if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta") && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 1)
    {
       if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Gay delta on key"))
       Onkey = true
       else
       Onkey = false
    }

        if (Standing == true || GayHP == true || SGayWalk == true || Onkey == true && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta"))
        {
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 10);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(0);
            AntiAim.SetRealOffset(-26);
        }
        else
        {
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 0);
            AntiAim.SetOverride(0);
        }
}

function drawString()
{
    const fontpixel = Render.AddFont( "Verdana", 10, 100);
    const Gaydelta_dropdown_value = UI.GetValue.apply(null, Gaydelta_modes);
    var SFOnkey = false
    var screen_size = Global.GetScreenSize();

    localplayer_index = Entity.GetLocalPlayer( );
    localplayer_alive = Entity.IsAlive( localplayer_index );

    GayWalk = false
    GayHP = false
    Standing = false
    Onkey = false

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta") && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 0)
    {
       if (Gaydelta_dropdown_value & (1 << 0) && UI.IsHotkeyActive("Anti-Aim", "Extra", "Gay walk"))
       GayWalk = true
       else
       GayWalk = false

       if (Gaydelta_dropdown_value & (1 << 1) && health < 50)
       GayHP = true
       else
       GayHP = false

       if (Gaydelta_dropdown_value & (1 << 2) && velocity < 3)
       Standing = true
       else
       Standing = false
    }
    else if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta") && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta type") == 1)
    {
       if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Gay delta on key"))
       Onkey = true
       else
       Onkey = false
    }
 
    if (Standing == true || GayHP == true || GayWalk == true || Onkey == true)
    {
        drawIND = true
    }
    else
    {
        drawIND = false
    }
 
    if (drawIND == true && localplayer_alive == true && UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Gay delta") == true)
    {
       Render.StringCustom(screen_size[0] /2 , screen_size[1] /2 +16, 1, " punpun <3", [ 163, 180, 255, 255 ], fontpixel );
       Render.StringCustom(screen_size[0] /2 , screen_size[1] /2 +32, 1, " Gay detla uwu", [ 163, 180, 255, 255 ], fontpixel );
    }
}

Global.RegisterCallback("Draw", "drawString");
Global.RegisterCallback("Draw", "SetEnabled");
Cheat.RegisterCallback("CreateMove", "Gay_delta");

//Punpun <3


