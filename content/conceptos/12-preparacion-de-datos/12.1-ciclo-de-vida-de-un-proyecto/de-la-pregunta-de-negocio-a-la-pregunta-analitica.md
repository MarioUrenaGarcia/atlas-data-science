---
id: de-la-pregunta-de-negocio-a-la-pregunta-analitica
titulo: De la pregunta de negocio a la pregunta analítica
titulo_en: From business question to analytical question
alias:
  - operacionalización de la pregunta
  - pregunta analítica
  - definición operativa
modulo: 12
submodulo: '12.1'
orden: 3
nivel: basico
prerrequisitos:
  - planteamiento-del-problema
  - parametro-y-estadistico
etiquetas:
  - proceso
  - definición operativa
  - métricas
  - ajuste por riesgo
resumen: >
  Una pregunta de negocio se vuelve analítica cuando se precisan la decisión, las unidades, la medida,
  el periodo y la comparación; cada definición operativa distinta puede dar una respuesta distinta.
formula: '\mathrm{RME}_h = \frac{O_h}{E_h},\qquad E_h = \sum_{s} n_{hs}\, r_s'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: pregunta
    caso: sucursales
referencias:
  - clave: kohavi
  - clave: agresti
publicado: true
---

## Intuición

"¿Cuál es nuestra mejor sucursal?" parece una pregunta clara hasta que se intenta responder con datos. ¿Mejor en ventas totales, que favorecen a las sucursales grandes? ¿En ventas por empleado? ¿En crecimiento? ¿En utilidad? Cada lectura es razonable y cada una puede señalar a una sucursal diferente. La pregunta de negocio expresa una preocupación; la pregunta analítica es la que puede calcularse.

Pasar de una a otra consiste en contestar, en orden, algunas preguntas que el solicitante no se hizo: para qué decisión servirá la respuesta, qué unidades se comparan, con qué medida, en qué periodo y frente a qué referencia. El resultado es una pregunta que tiene una sola respuesta numérica y que, además, es la que importa para la decisión. Si se trata de dónde abrir una tienda nueva, interesa la rentabilidad por empleado de sucursales maduras, no las ventas totales de una tienda que lleva décadas en la mejor esquina de la ciudad.

## Definición

:::definicion[Pregunta analítica]
Una **pregunta analítica** es una versión de la pregunta de negocio en la que están definidos:

1. la **decisión** a la que sirve;
2. las **unidades** que se comparan o predicen;
3. la **medida**, con una definición operativa calculable a partir de los datos;
4. el **periodo** de referencia;
5. la **comparación**: contra qué valor, grupo o escenario se contrasta.

Además se clasifica por su tipo: **descriptiva** (cuánto o cuál), **diagnóstica** (por qué), **predictiva** (qué pasará) o **causal** (qué pasaría si se interviene).
:::

Un caso frecuente de definición operativa es comparar unidades que atienden poblaciones distintas. En la **estandarización indirecta**, cada hospital $h$ se compara con las muertes que tendría si sus pacientes de cada estrato de riesgo $s$ murieran a la tasa de toda la red:

$$
E_h = \sum_{s} n_{hs}\, r_s, \qquad \mathrm{RME}_h = \frac{O_h}{E_h}, \qquad \text{tasa ajustada}_h = \mathrm{RME}_h \cdot r .
$$

:::nota[Qué significa cada símbolo]
- $h$: hospital (o, en general, unidad comparada).
- $s$: estrato de riesgo de los pacientes, por ejemplo bajo y alto.
- $n_{hs}$: número de pacientes del hospital $h$ en el estrato $s$.
- $r_s$: tasa de mortalidad del estrato $s$ en toda la red.
- $E_h$: muertes esperadas en el hospital $h$ con las tasas de la red.
- $O_h$: muertes observadas en el hospital $h$.
- $\mathrm{RME}_h$: razón de mortalidad estandarizada; mayor que $1$ indica más muertes de las esperadas.
- $r$: tasa de mortalidad global de la red.
:::

## Cómo usar la visualización

La parte superior muestra la pregunta de negocio. Al reproducir, cada etiqueta (para qué decisión, qué unidades, medido cómo, en qué periodo, comparado con qué) agrega un fragmento a la pregunta analítica; el fragmento nuevo se resalta.

Las barras muestran el valor de cada unidad según la definición operativa elegida en el selector, y la barra naranja marca a la mejor. La lectura "Ganadores distintos entre definiciones" cuenta cuántas unidades distintas resultan "la mejor" según la definición. Experimentos sugeridos: recorrer las cuatro definiciones de sucursales y observar que cada una corona a una sucursal diferente; en el caso de hospitales, comparar la mortalidad bruta con la ajustada por riesgo.

## Ejemplo

La pregunta "¿qué hospital tiene la mejor atención?" se precisa como: menor mortalidad a 30 días en los egresos del último año, tomando en cuenta el riesgo de los pacientes. La red tiene 5000 pacientes, 307 muertes ($r = 0.0614$) y tasas por estrato $r_{\text{bajo}} = 44/2850 = 0.0154$ y $r_{\text{alto}} = 263/2150 = 0.1223$.

1. Hospital A: 800 pacientes de bajo riesgo, 200 de alto riesgo y 46 muertes. Su mortalidad bruta es $46/1000 = 4.6\,\%$, la más baja de la red.
2. Muertes esperadas: $E_A = 800(0.0154) + 200(0.1223) = 36.8$.
3. $\mathrm{RME}_A = 46/36.8 = 1.25$ y tasa ajustada $1.25 \cdot 6.14\,\% = 7.67\,\%$, la más alta.
4. Hospital D: 450 y 550 pacientes, 64 muertes, mortalidad bruta $6.4\,\%$. $E_D = 450(0.0154) + 550(0.1223) = 74.2$, $\mathrm{RME}_D = 0.86$, tasa ajustada $5.29\,\%$, la más baja.

El hospital A parecía el mejor porque atiende sobre todo pacientes de bajo riesgo; una vez ajustado, es el que más se aleja de lo esperado.

:::figura[Hospitales: con la mortalidad bruta gana el hospital A; con la ajustada por riesgo, el hospital D, y A queda en último lugar.]{componente="DataProjectViz"}
```yaml
modo: pregunta
caso: hospitales
definicion: 1
```
:::

## Propiedades

- **Una pregunta vaga no tiene una respuesta, tiene varias.** En el caso de sucursales, cuatro definiciones razonables de "mejor" eligen cuatro sucursales distintas.
- **La comparación define el resultado tanto como la medida.** En el caso de escuelas, el promedio en el examen premia a la escuela que recibe a los estudiantes mejor preparados; la ganancia sobre el puntaje de ingreso premia a la que más aporta.

:::figura[Escuelas: la ganancia sobre el puntaje de ingreso señala a la escuela 3, mientras que el promedio bruto señala a la escuela 1, que agrega apenas 7 puntos al nivel de ingreso de sus estudiantes.]{componente="DataProjectViz"}
```yaml
modo: pregunta
caso: escuelas
definicion: 3
```
:::

- **El tipo de pregunta decide el método.** Una pregunta descriptiva se responde con un resumen; una causal ("¿qué escuela debemos imitar?") exige comparar unidades similares o diseñar un experimento.

## Errores comunes

- **Responder la pregunta fácil en lugar de la importante.** Las ventas totales se calculan en segundos, pero la decisión de abrir una tienda depende de la rentabilidad por empleado.
- **Comparar unidades con poblaciones distintas sin ajustar.** La mortalidad bruta castiga a los hospitales que reciben los casos graves y premia a los que reciben los leves.
- **Dejar el periodo implícito.** "Las ventas de la sucursal Poniente" crecen 15 % en el último año pero son de las más bajas en total: sin periodo y sin comparación, ambas frases describen la misma sucursal con conclusiones opuestas.

:::figura[Error de no ajustar: la mortalidad bruta coloca en primer lugar al hospital A, que atiende la menor proporción de pacientes de alto riesgo.]{componente="DataProjectViz"}
```yaml
modo: pregunta
caso: hospitales
definicion: 0
```
:::

:::figura[Error de dejar implícito el periodo y la comparación: con el crecimiento anual, la sucursal Poniente es la mejor aunque sus ventas totales estén entre las más bajas.]{componente="DataProjectViz"}
```yaml
modo: pregunta
caso: sucursales
definicion: 2
```
:::

## Conexiones

Esta traducción es el núcleo del [[planteamiento-del-problema]] y su medida de éxito se discute en [[metricas-de-negocio-vs-metricas-del-modelo]]. El tipo de pregunta corresponde a los tipos de [[analitica-descriptiva-diagnostica-predictiva-y-prescriptiva|analítica]]. La medida operativa es un [[parametro-y-estadistico|parámetro]] de una [[poblacion-y-muestra|población]] bien delimitada, y el cambio de conclusión al ajustar por riesgo es una manifestación de la [[paradoja-de-simpson]]. Que una correlación entre una práctica y un buen resultado no baste para imitarla se discute en [[correlacion-no-implica-causalidad]].

## Formulario

:::formula[Muertes esperadas por estandarización indirecta]
$$
E_h = \sum_{s} n_{hs}\, r_s
$$

- $E_h$: muertes esperadas en la unidad $h$.
- $n_{hs}$: casos de la unidad $h$ en el estrato $s$.
- $r_s$: tasa del estrato $s$ en la población de referencia.
:::

:::formula[Razón estandarizada y tasa ajustada]
$$
\mathrm{RME}_h = \frac{O_h}{E_h}, \qquad \text{tasa ajustada}_h = \mathrm{RME}_h \cdot r
$$

- $O_h$: eventos observados en la unidad $h$.
- $E_h$: eventos esperados.
- $\mathrm{RME}_h$: razón estandarizada; $1$ significa lo esperado.
- $r$: tasa global de la población de referencia.
:::

:::formula[Ganancia sobre el punto de partida]
$$
G_i = y_i^{\text{final}} - y_i^{\text{inicial}}
$$

- $G_i$: ganancia de la unidad $i$.
- $y_i^{\text{final}}$: medida al final del periodo, por ejemplo el promedio en el examen.
- $y_i^{\text{inicial}}$: medida al inicio, por ejemplo el puntaje de ingreso.
:::
