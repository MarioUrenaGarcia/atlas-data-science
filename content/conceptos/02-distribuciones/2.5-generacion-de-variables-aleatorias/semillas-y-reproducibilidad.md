---
id: semillas-y-reproducibilidad
titulo: Semillas y reproducibilidad
titulo_en: Seeds and reproducibility
alias:
  - semilla aleatoria
  - fijar la semilla
  - reproducibilidad de simulaciones
modulo: 2
submodulo: '2.5'
orden: 4
nivel: intermedio
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
relaciones:
  - tipo: relacionado
    id: mersenne-twister
etiquetas:
  - semilla
  - reproducibilidad
  - simulación
  - depuración
  - ciencia abierta
resumen: >
  La semilla es el estado inicial de un generador pseudoaleatorio. Fijarla hace que una simulación
  produzca exactamente los mismos números cada vez, y cambiarla da una muestra independiente en la práctica.
formula: 's_0 \;\mapsto\; (u_1, u_2, \dots) \quad \text{es una función: la misma semilla da la misma sucesión}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: semilla
    valores:
      a: 2024
      b: 2024
    casos:
      - nombre: 'Misma semilla'
        descripcion: 'Las dos corridas usan 2024: las líneas coinciden punto por punto y los veinte valores son iguales.'
        valores: {a: 2024, b: 2024}
      - nombre: 'Semillas vecinas'
        descripcion: '2024 y 2025: aunque las semillas difieren en una unidad, las sucesiones no se parecen en nada.'
        valores: {a: 2024, b: 2025}
      - nombre: 'Semilla de referencia'
        descripcion: '5489 y 1: la primera es la semilla por omisión del Mersenne Twister original.'
        valores: {a: 5489, b: 1}
referencias:
  - clave: ross-procesos
  - clave: gelman-bda
publicado: true
---

## Intuición

Un analista corre una simulación de un sistema de colas y obtiene un tiempo de espera promedio de 4.2 minutos. Un colega repite el análisis y obtiene 4.5. ¿Hay un error o es solo azar? Si los dos fijaron la misma semilla del generador, deberían obtener exactamente el mismo número, y cualquier diferencia apunta a un cambio en el código o en los datos. Si no la fijaron, las diferencias son esperables y no dicen nada.

La semilla es el estado inicial del generador pseudoaleatorio. Como el generador es determinista, la semilla determina por completo toda la sucesión de números: la misma semilla produce siempre los mismos valores, en el mismo orden. Esto convierte a las simulaciones en experimentos repetibles, permite depurar un programa que falla solo a veces y hace posible que otras personas verifiquen un resultado.

Cambiar la semilla, en cambio, produce otra sucesión que, para fines prácticos, se comporta como una muestra independiente. Con un buen generador, semillas que difieren en una sola unidad dan sucesiones que no tienen ninguna relación visible. Por eso el procedimiento habitual es fijar una semilla para reproducir y repetir con varias semillas para ver cuánto varía el resultado por azar.

## Definición

:::definicion[Semilla]
La **semilla** $s_0$ es el estado inicial de un generador $(S, T, G)$. Define la sucesión
$$
u_n = G\big(T^{n}(s_0)\big), \qquad n = 1, 2, \dots,
$$
de modo que $s_0 \mapsto (u_1, u_2, \dots)$ es una función: dos corridas con la misma semilla producen sucesiones idénticas.
:::

Una simulación es **reproducible** si con la misma semilla, el mismo código y los mismos datos produce el mismo resultado. Para estimar la variabilidad por azar se repite con semillas distintas $s_0^{(1)}, \dots, s_0^{(R)}$ y se resumen los $R$ resultados.

:::nota[Qué es X]
$U_n$ = el valor en la posición $n$ de la sucesión que produce el generador a partir de la semilla.
:::

:::nota[Qué hace cada parámetro]
- **$s_1$, semilla de la primera corrida:** el estado inicial de la primera sucesión. Si cambia, cambian todos sus valores.
- **$s_2$, semilla de la segunda corrida:** si es igual a $s_1$, las sucesiones coinciden por completo; si difiere aunque sea en una unidad, no se parecen.
:::

:::nota[Qué significa cada símbolo]
- $s_0$: semilla; $S$: estados; $T$: transición; $T^{n}$: $n$ aplicaciones de $T$.
- $G$: función de salida; $u_n$: valor $n$ de la sucesión.
- $R$: número de repeticiones con semillas distintas; $s_0^{(r)}$: semilla de la repetición $r$.
:::

## Cómo usar la visualización

Las dos líneas son los primeros veinte valores del Mersenne Twister con dos semillas; debajo aparecen sus primeros seis números. El panel cuenta cuántos de los veinte coinciden y da el primer valor de cada corrida. Los casos cargan la misma semilla, semillas vecinas y la semilla de referencia.

Con la misma semilla observa que las dos líneas están encimadas. Cambia la segunda semilla en una unidad y observa que las líneas se separan por completo. Regresa a la semilla original y comprueba que los valores vuelven a ser exactamente los mismos.

## Ejemplo

Un estudio simula con el Mersenne Twister y la semilla 2024.

1. Los primeros tres valores son 0.588015, 0.757153 y 0.699109.
2. Repetir la simulación con la semilla 2024, en otra computadora y otro día, produce exactamente los mismos tres valores y, por lo tanto, el mismo resultado final.
3. Con la semilla 2025 el primer valor es 0.135488: nada en él recuerda a 0.588015.
4. Para reportar la incertidumbre por azar, se corre la simulación con 30 semillas distintas y se dan la media y la desviación de los 30 resultados.
5. En el informe se anotan la semilla, el generador y la versión del programa, para que cualquier persona pueda reproducir el número exacto.

:::figura[Semillas vecinas: 2024 y 2025 producen sucesiones sin relación; ningún valor coincide aunque las semillas difieren en una unidad.]{componente="RandomLab"}
```yaml
modo: semilla
valores:
  a: 2024
  b: 2025
```
:::

## Propiedades

- **Determinismo:** misma semilla, misma sucesión; es una propiedad del algoritmo, no del azar.
- **Independencia práctica:** con un buen generador, semillas distintas dan sucesiones que se comportan como independientes.
- **Portabilidad:** el resultado se reproduce si se usan el mismo generador y la misma forma de transformar sus salidas; cambiar de versión de una biblioteca puede cambiar los números aunque la semilla sea igual.
- **Paralelismo:** en simulaciones paralelas se usan flujos separados (saltos adelante o generadores con subsucesiones) en lugar de semillas consecutivas.
- **Variabilidad:** la diferencia entre resultados con semillas distintas mide el error de Monte Carlo.
- **En el Atlas:** cada visualización muestra su semilla, que se puede cambiar o restablecer para repetir exactamente una simulación.

:::figura[Casos con contexto (misma semilla, semillas vecinas, semilla de referencia): cada botón carga las dos semillas y una frase explica qué se ve.]{componente="RandomLab"}
```yaml
modo: semilla
valores:
  a: 5489
  b: 1
casos:
  - nombre: 'Misma semilla'
    descripcion: '20 de 20 valores iguales.'
    valores: {a: 2024, b: 2024}
  - nombre: 'Semillas vecinas'
    descripcion: 'Sucesiones sin relación.'
    valores: {a: 2024, b: 2025}
  - nombre: 'Semilla de referencia'
    descripcion: '5489 es la semilla por omisión del algoritmo original.'
    valores: {a: 5489, b: 1}
```
:::

## Errores comunes

- **Buscar la semilla que da el resultado deseado.** Probar semillas hasta obtener un valor favorable invalida la simulación; la semilla se fija antes de ver los resultados.
- **Creer que fijar la semilla quita la variabilidad.** Solo la congela; el resultado sigue siendo una muestra y debe acompañarse de su error de Monte Carlo.
- **Volver a fijar la semilla dentro de un ciclo.** Si se fija la misma semilla en cada repetición, todas las repeticiones son idénticas y la variabilidad aparente es cero.
- **No registrar la versión del software.** La misma semilla con otra implementación puede dar números distintos.

:::figura[Sembrar en cada repetición: si las dos corridas usan la misma semilla, sus valores coinciden y la variabilidad entre repeticiones desaparece.]{componente="RandomLab"}
```yaml
modo: semilla
valores:
  a: 7
  b: 7
```
:::

## Conexiones

La semilla es el estado inicial de los [[generadores-de-numeros-pseudoaleatorios]], como el [[generador-congruencial-lineal]] o el [[mersenne-twister]]. La reproducibilidad permite comparar métodos de generación como el [[metodo-de-box-muller]] o el [[metodo-de-aceptacion-y-rechazo]] con los mismos números de partida. Repetir con varias semillas es la forma de medir el error de las estimaciones por Monte Carlo. El [[mapa-de-relaciones-entre-distribuciones]] muestra cómo, a partir de uniformes, se construyen otras distribuciones.

## Formulario

:::formula[Sucesión determinada por la semilla]
$$
u_n = G\big(T^{n}(s_0)\big)
$$

- $s_0$: semilla; $T$: transición; $G$: salida; $n$: posición.
:::

:::formula[Error de Monte Carlo con R semillas]
$$
\bar{\theta} = \frac{1}{R}\sum_{r=1}^{R}\hat{\theta}_r, \qquad \text{error estándar} \approx \frac{s_{\hat{\theta}}}{\sqrt{R}}
$$

- $\hat{\theta}_r$: resultado con la semilla $r$; $R$: número de semillas; $s_{\hat{\theta}}$: desviación de los resultados.
:::
